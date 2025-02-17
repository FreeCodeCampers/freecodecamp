import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '../../utils/env';
import {
  donationSubscriptionConfig,
  allStripeProductIdsArray
} from '../../../../shared/config/donation-settings';
import * as schemas from '../../schemas';
import { inLastFiveMinutes } from '../../utils/validate-donation';
import { findOrCreateUser } from '../helpers/auth-helpers';

/**
 * Plugin for public donation endpoints.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const chargeStripeRoute: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  // Stripe plugin
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true
  });

  fastify.post(
    '/donate/create-stripe-payment-intent',
    {
      schema: schemas.createStripePaymentIntent
    },
    async (req, reply) => {
      const { email, name, amount, duration } = req.body;
      const log = fastify.log.child({ req, email, amount, duration });
      log.debug('Creating Stripe payment intent');

      if (!donationSubscriptionConfig.plans[duration].includes(amount)) {
        void reply.code(400);
        return {
          error: 'The donation form had invalid values for this submission.'
        } as const;
      }

      try {
        const stripeCustomer = await stripe.customers.create({
          email,
          name
        });

        const stripeSubscription = await stripe.subscriptions.create({
          customer: stripeCustomer.id,
          items: [
            {
              plan: `${donationSubscriptionConfig.duration[duration]}-donation-${amount}`
            }
          ],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent']
        });

        if (
          stripeSubscription.latest_invoice &&
          typeof stripeSubscription.latest_invoice !== 'string' &&
          stripeSubscription.latest_invoice.payment_intent &&
          typeof stripeSubscription.latest_invoice.payment_intent !==
            'string' &&
          stripeSubscription.latest_invoice.payment_intent.client_secret !==
            null
        ) {
          const clientSecret =
            stripeSubscription.latest_invoice.payment_intent.client_secret;
          log.info('Successfully created payment intent');
          return reply.send({
            subscriptionId: stripeSubscription.id,
            clientSecret
          });
        } else {
          throw new Error('Stripe payment intent client secret is missing');
        }
      } catch (error) {
        log.error(error, 'Failed to create payment intent');
        fastify.Sentry.captureException(error);
        void reply.code(500);
        return reply.send({
          error: 'Donation failed due to a server error.'
        });
      }
    }
  );

  fastify.post(
    '/donate/charge-stripe',
    {
      schema: schemas.chargeStripe
    },
    async (req, reply) => {
      try {
        const { email, amount, duration, subscriptionId } = req.body;
        const log = fastify.log.child({
          req,
          email,
          amount,
          duration,
          subscriptionId
        });
        log.debug('Processing Stripe charge');

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const isSubscriptionActive = subscription.status === 'active';
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const productId = subscription.items.data[0]?.plan.product?.toString();
        const isStartedRecently = inLastFiveMinutes(
          subscription.current_period_start
        );
        const isProductIdValid =
          productId && allStripeProductIdsArray.includes(productId);
        const isValidCustomer = typeof subscription.customer === 'string';

        if (!isSubscriptionActive) {
          log.warn('Invalid subscription status', {
            status: subscription.status
          });
          throw new Error(
            `Stripe subscription information is invalid: ${subscriptionId}`
          );
        }
        if (!isProductIdValid) {
          log.warn('Invalid product ID', { productId });
          throw new Error(`Product ID is invalid: ${subscriptionId}`);
        }
        if (!isStartedRecently) {
          log.warn('Subscription not recent', {
            startTime: subscription.current_period_start
          });
          throw new Error(`Subscription is not recent: ${subscriptionId}`);
        }
        if (!isValidCustomer) {
          log.warn('Invalid customer ID', {
            customerId: subscription.customer
          });
          throw new Error(`Customer ID is invalid: ${subscriptionId}`);
        }

        const user = await findOrCreateUser(fastify, email);
        log.debug('Found or created user', { userId: user.id });

        const donation = {
          userId: user.id,
          email,
          amount,
          duration,
          provider: 'stripe',
          subscriptionId,
          customerId: subscription.customer as string,
          // TODO(Post-MVP) migrate to startDate: new Date()
          startDate: {
            date: new Date().toISOString(),
            when: new Date().toISOString().replace(/.$/, '+00:00')
          }
        };

        await fastify.prisma.donation.create({
          data: donation
        });

        await fastify.prisma.user.update({
          where: { id: user.id },
          data: {
            isDonating: true
          }
        });
        log.info('Successfully processed donation');

        return reply.send({
          isDonating: true
        });
      } catch (error) {
        fastify.log.error(error, 'Failed to process Stripe charge');
        fastify.Sentry.captureException(error);
        void reply.code(500);
        return {
          error: 'Donation failed due to a server error.'
        } as const;
      }
    }
  );

  done();
};
