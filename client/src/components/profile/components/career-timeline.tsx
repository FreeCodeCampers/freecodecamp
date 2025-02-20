import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Modal,
  Spacer
} from '@freecodecamp/ui';
import { TFunction } from 'i18next';
import { FullWidthRow } from '../../helpers';
import './career-timeline.css';
import { Career } from '../../../redux/prop-types';
import { parseDate } from './utils';

interface DeleteModalProps {
  isDeleting: boolean;
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
  setIsDeleting: (value: boolean) => void;
  setMyCareer: (value: Career[]) => void;
  updateMyCareer: (value: { career: Career[] }) => void;
  setIsEditing: (value: boolean) => void;
  myCareer: Career[];
  t: TFunction;
}

interface EditCareerTimelineProps {
  myCareer: Career[];
  selectedIndex: number;
  setIsAdding: (value: boolean) => void;
  isAdding: boolean;
  isEditing: boolean;
  setSelectedIndex: (value: number) => void;
  setIsEditing: (value: boolean) => void;
  setMyCareer: (value: Career[]) => void;
  updateMyCareer: (value: { career: Career[] }) => void;
  t: TFunction;
}

interface CareerTimelineProps {
  career: Career[];
  isSessionUser: boolean;
  updateMyCareer: (value: { career: Career[] }) => void;
}

const DeleteModal = ({
  isDeleting,
  setIsEditing,
  selectedIndex,
  setSelectedIndex,
  setIsDeleting,
  setMyCareer,
  updateMyCareer,
  myCareer,
  t
}: DeleteModalProps) => {
  const handleDelete = (selectedIndex: number) => {
    const updatedCareer = myCareer.filter((_job, index) => {
      return index !== selectedIndex;
    });

    updateMyCareer({ career: updatedCareer });
    setMyCareer(updatedCareer);

    setIsDeleting(false);
    setIsEditing(false);
    setSelectedIndex(-1);
  };

  return (
    <>
      <Modal
        onClose={() => {
          setIsDeleting(false);
          setSelectedIndex(-1);
        }}
        variant='danger'
        open={isDeleting}
      >
        <Modal.Header>{t('profile.job-delete-heading')}</Modal.Header>
        <Modal.Body>
          <p>{t('profile.job-delete')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Spacer size='s' />
          <Button
            variant='danger'
            onClick={() => {
              handleDelete(selectedIndex);
            }}
          >
            {t('buttons.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditCareerTimeline = ({
  myCareer,
  selectedIndex,
  isAdding,
  isEditing,
  setSelectedIndex,
  updateMyCareer,
  setMyCareer,
  setIsAdding,
  setIsEditing,
  t
}: EditCareerTimelineProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();

    const form = formEvent.target as HTMLFormElement;
    const formData = new FormData(form);

    let newCareer;

    if (isEditing) {
      newCareer = myCareer.map((job, i) => {
        if (i === selectedIndex) {
          return {
            title: (formData.get('title') as string) || '',
            company: (formData.get('company') as string) || '',
            location: (formData.get('location') as string) || '',
            start_date: (formData.get('start_date') as string) || '',
            end_date: (formData.get('end_date') as string) || '',
            description: (formData.get('description') as string) || ''
          };
        }

        return job;
      });
    } else if (isAdding) {
      newCareer = [
        ...myCareer,
        {
          title: (formData.get('title') as string) || '',
          company: (formData.get('company') as string) || '',
          location: (formData.get('location') as string) || '',
          start_date: (formData.get('start_date') as string) || '',
          end_date: (formData.get('end_date') as string) || '',
          description: (formData.get('description') as string) || ''
        }
      ];
    } else {
      newCareer = myCareer;
    }

    setIsEditing(false);
    setIsAdding(false);
    setSelectedIndex(-1);

    updateMyCareer({ career: newCareer });
    setMyCareer(newCareer);

    return formEvent;
  };

  let job = {
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: ''
  };

  if (selectedIndex > -1) {
    job = myCareer[selectedIndex];
  }

  return (
    <>
      <DeleteModal
        isDeleting={isDeleting}
        setSelectedIndex={setSelectedIndex}
        setIsDeleting={setIsDeleting}
        setMyCareer={setMyCareer}
        updateMyCareer={updateMyCareer}
        myCareer={myCareer}
        selectedIndex={selectedIndex}
        setIsEditing={setIsEditing}
        t={t}
      />
      <form key={job.company} onSubmit={handleSubmit}>
        <FormGroup controlId='title'>
          <ControlLabel htmlFor='title'>{t('profile.job-title')}</ControlLabel>
          <FormControl
            placeholder='title'
            name='title'
            defaultValue={job.title}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId='company'>
          <ControlLabel htmlFor='company'>
            {t('profile.job-company')}
          </ControlLabel>
          <FormControl
            placeholder='Company'
            name='company'
            defaultValue={job.company}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId='location'>
          <ControlLabel htmlFor='location'>
            {t('profile.job-location')}
          </ControlLabel>
          <FormControl
            placeholder='Location'
            name='location'
            defaultValue={job.location}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId='start_date'>
          <ControlLabel htmlFor='start_date'>
            {t('profile.job-start-date')}
          </ControlLabel>
          <FormControl
            type='date'
            name='start_date'
            min='1950-01-01'
            max={new Date().toISOString().split('T')[0]}
            defaultValue={
              job.end_date
                ? new Date(job.end_date).toISOString().split('T')[0]
                : ''
            }
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId='end_date'>
          <ControlLabel htmlFor='end_date'>
            {t('profile.job-end-date')}
          </ControlLabel>
          <FormControl
            type='date'
            name='end_date'
            min='1950-01-01'
            max={new Date().toISOString().split('T')[0]}
            defaultValue={
              job.end_date
                ? new Date(job.end_date).toISOString().split('T')[0]
                : ''
            }
          ></FormControl>
        </FormGroup>
        <FormGroup controlId='description'>
          <ControlLabel htmlFor='description'>
            {t('profile.job-description')}
          </ControlLabel>
          <FormControl
            placeholder='Description'
            name='description'
            defaultValue={job.description}
            required
          ></FormControl>
        </FormGroup>
        {isEditing && (
          <Button
            variant='danger'
            block={true}
            onClick={() => setIsDeleting(true)}
          >
            {t('buttons.delete')}
          </Button>
        )}
        <Spacer size='xs' />
        <Button
          block={true}
          onClick={() => {
            setIsEditing(false);
            setIsAdding(false);
            setSelectedIndex(-1);
          }}
        >
          {t('buttons.cancel')}
        </Button>
        <Spacer size='xs' />
        <Button block={true} type='submit'>
          {t('buttons.save')}
        </Button>
      </form>
    </>
  );
};

const CareerTimeline = ({
  career,
  isSessionUser,
  updateMyCareer
}: CareerTimelineProps) => {
  const [myCareer, setMyCareer] = useState<Career[]>(career);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { t } = useTranslation();

  return (
    <FullWidthRow>
      <section className='card'>
        <div className='header-container'>
          <h2>{t('profile.your-exp')}</h2>

          {isSessionUser && (
            <Button
              className='edit-btn'
              disabled={isAdding || isEditing}
              aria-disabled={isAdding || isEditing}
              aria-label={t('profile.job-add')}
              onClick={() => {
                setIsAdding(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          )}
        </div>

        {isAdding || isEditing ? (
          <EditCareerTimeline
            myCareer={myCareer}
            selectedIndex={selectedIndex}
            isAdding={isAdding}
            isEditing={isEditing}
            setSelectedIndex={setSelectedIndex}
            setMyCareer={setMyCareer}
            updateMyCareer={updateMyCareer}
            setIsAdding={setIsAdding}
            setIsEditing={setIsEditing}
            t={t}
          />
        ) : (
          <></>
        )}

        {!myCareer.length && !isAdding && (
          <p>
            {isSessionUser
              ? t('profile.job-not-added')
              : t('profile.job-not-added-viewer')}
          </p>
        )}
        {myCareer.map((job: Career, index) => {
          const start = parseDate(
            new Date(job.start_date).toDateString(),
            t,
            'short'
          );
          let end = t('profile.present');

          const present = new Date();

          let total_time_in_years =
            present.getFullYear() - new Date(job.start_date).getFullYear();

          if (job.end_date) {
            end = parseDate(new Date(job.end_date).toDateString(), t, 'short');

            total_time_in_years =
              new Date(job.end_date).getFullYear() -
              new Date(job.start_date).getFullYear();
          }

          return (
            !isAdding &&
            !isEditing && (
              <Fragment key={index}>
                <div className='header'>
                  <h3>
                    {t('profile.job-at', {
                      company: job.company,
                      title: job.title
                    })}
                  </h3>

                  {isSessionUser && (
                    <Button
                      className='edit-btn'
                      aria-label={t('profile.job-edit', {
                        company: job.company
                      })}
                      onClick={() => {
                        setIsEditing(true);
                        setSelectedIndex(index);
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  )}
                </div>
                <div className='job-info'>
                  <p className='date'>
                    {t('profile.start-end-years', {
                      start: start,
                      end: end,
                      years: total_time_in_years
                    })}
                  </p>
                  <p>{job.location}</p>
                </div>
                <p>{job.description}</p>
              </Fragment>
            )
          );
        })}
      </section>
      <hr />
    </FullWidthRow>
  );
};

export default CareerTimeline;
