import React, { useEffect, useState } from 'react';
import { Characters, CharacterPosition } from '../../../../redux/prop-types';
import { characterAssets } from './scene-assets';

import './character.css';
import { SceneSubject } from './scene-subject';

interface CharacterProps {
  position: CharacterPosition;
  opacity: number;
  name: Characters;
  isTalking: boolean;
  sceneSubject: SceneSubject;
}

interface CharacterStyles {
  left?: string;
  top?: string;
  transform?: string;
  opacity?: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Character({
  position,
  opacity,
  name,
  isTalking,
  sceneSubject
}: CharacterProps): JSX.Element {
  const [eyesAreOpen, setEyesAreOpen] = useState(true);
  const [mouthIsOpen, setMouthIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onNotify = (eventType: 'play' | 'pause' | 'stop') => {
    if (eventType === 'play') {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    sceneSubject.attach(onNotify);
    return () => {
      sceneSubject.detach(onNotify);
    };
  }, [sceneSubject]);

  useEffect(() => {
    if (!isPlaying) return;
    let blinkTimeoutId: NodeJS.Timeout;

    const blinkPeriod = getRandomInt(2000, 5000);
    const blinkIntervalId = setInterval(() => {
      const blinkJitter = getRandomInt(0, 1000);
      blinkTimeoutId = setTimeout(() => {
        setEyesAreOpen(false);

        blinkTimeoutId = setTimeout(() => {
          setEyesAreOpen(true);
        }, 30); // always unblink after 30ms
      }, blinkJitter);
    }, blinkPeriod);

    // Clear intervals when component is unmounted or conditions change
    return () => {
      setEyesAreOpen(true);
      clearInterval(blinkIntervalId);
      clearTimeout(blinkTimeoutId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    let talkIntervalId: NodeJS.Timeout;
    let mouthOpenTimeoutId: NodeJS.Timeout;
    let mouthCloseTimeoutId: NodeJS.Timeout;

    if (isTalking) {
      const talk = () => {
        const openTimeout = getRandomInt(0, 100);
        const closeTimeout = getRandomInt(150, 300);

        mouthOpenTimeoutId = setTimeout(() => {
          setMouthIsOpen(true);
        }, openTimeout);

        mouthCloseTimeoutId = setTimeout(() => {
          setMouthIsOpen(false);
        }, closeTimeout);
      };

      talk();
      talkIntervalId = setInterval(() => {
        talk();
      }, 300);
    }

    // Clear intervals when component is unmounted or conditions change
    return () => {
      setMouthIsOpen(false);
      clearInterval(talkIntervalId);
      clearTimeout(mouthOpenTimeoutId);
      clearTimeout(mouthCloseTimeoutId);
    };
  }, [isTalking, isPlaying]);

  const characterWrapStyles: CharacterStyles = {
    opacity
  };
  if (position.x) characterWrapStyles.left = `${position.x}%`;
  if (position.y) characterWrapStyles.top = `${position.y}%`;

  const characterFeatureStyles: CharacterStyles = {
    transform: position.z
      ? `translate(-${50 * position.z}%) scale(${position.z})`
      : `translate(-50%)`
  };

  const { base, brows, eyesOpen, eyesClosed, mouthOpen, mouthClosed, glasses } =
    characterAssets[name];

  return (
    <div style={characterWrapStyles} className='character-wrap'>
      <img
        style={characterFeatureStyles}
        className='character-feature'
        src={base}
        alt=''
      />
      <img
        style={characterFeatureStyles}
        className='character-feature'
        src={brows}
        alt=''
      />
      <img
        style={characterFeatureStyles}
        className='character-feature'
        src={eyesAreOpen ? eyesOpen : eyesClosed}
        alt=''
      />
      <img
        style={characterFeatureStyles}
        className='character-feature'
        src={mouthIsOpen ? mouthOpen : mouthClosed}
        alt=''
      />
      {glasses && (
        <img
          style={characterFeatureStyles}
          className='character-feature'
          src={glasses}
          alt=''
        />
      )}
    </div>
  );
}

Character.displayName = 'Character';

export default Character;
