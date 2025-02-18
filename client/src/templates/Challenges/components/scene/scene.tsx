import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback
} from 'react';
import { Col, Spacer } from '@freecodecamp/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { FullScene } from '../../../../redux/prop-types';
import { Loader } from '../../../../components/helpers';
import ClosedCaptionsIcon from '../../../../assets/icons/closedcaptions';
import { sounds, backgrounds, characterAssets } from './scene-assets';
import Character from './character';
import { SceneSubject } from './scene-subject';

import './scene.css';

const sToMs = (n: number) => n * 1000;

const loadImage = (src: string | null) => {
  if (src) new Image().src = src;
};

const initDialogue = { label: '', text: '', align: 'left' };

export function Scene({
  scene,
  sceneSubject
}: {
  scene: FullScene;
  sceneSubject: SceneSubject;
}): JSX.Element {
  const { t } = useTranslation();
  const canPauseRef = useRef(false);
  const { setup, commands } = scene;
  const { audio, alwaysShowDialogue } = setup;

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // if there are timestamps, we use the difference between them as the duration
  // if not, we assume we're playing the whole audio file.
  const duration =
    audio.startTimestamp !== null && audio.finishTimestamp !== null
      ? sToMs(audio.finishTimestamp - audio.startTimestamp)
      : Infinity;

  const pauseAudio = () => {
    // Until the play() promise resolves, we can't pause the audio
    if (canPauseRef.current) audioRef.current.pause();
    canPauseRef.current = false;
    clearTimeout(startTimerRef.current);
    clearTimeout(finishTimerRef.current);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    // @ts-expect-error cancelAnimationFrame accepts undefined, but TS doesn't
    // know that
    window.cancelAnimationFrame(animationRef.current);
  };

  const resetAudio = useCallback(() => {
    pauseAudio();
    audioRef.current.currentTime = audio.startTimestamp || 0;
    pausedAtRef.current = 0;
  }, [audio.startTimestamp]);

  // on mount
  useEffect(() => {
    const { current } = audioRef;
    const { audio } = setup;

    if (current) {
      const audioTimestamp =
        duration !== Infinity ? `#t=${audio.startTimestamp}` : '';
      current.volume = 1;
      current.addEventListener('canplaythrough', audioLoaded);
      current.src = `${sounds}/${audio.filename}${audioTimestamp}`;
      current.preload = 'auto';
      current.load();
    }

    // preload images
    loadImage(`${backgrounds}/${setup.background}`);

    setup.characters
      .map(({ character }) => Object.values(characterAssets[character]))
      .flat()
      .forEach(loadImage);

    commands
      .map(({ background }) =>
        background ? `${backgrounds}/${background}` : null
      )
      .forEach(loadImage);

    // on unmount
    return () => {
      resetAudio();
      current.removeEventListener('canplaythrough', audioLoaded);
    };
  }, [duration, setup, commands, resetAudio]);

  const initBackground = setup.background;

  // The characters are memoized to prevent the useEffect from running on every
  // render,
  const initCharacters = useMemo(
    () =>
      setup.characters.map(character => {
        return {
          ...character,
          opacity: character.opacity ?? 1,
          isTalking: false
        };
      }),
    [setup.characters]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneIsReady, setSceneIsReady] = useState(false);
  const [accessibilityOn, setAccessibilityOn] = useState(false);
  const [characters, setCharacters] = useState(initCharacters);
  const [dialogue, setDialogue] = useState(initDialogue);
  const [background, setBackground] = useState(initBackground);
  const startClocktimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const startTimerRef = useRef<number>();
  const finishTimerRef = useRef<number>();
  const animationRef = useRef<number>();
  const usedCommandsRef = useRef(new Set<number>());

  const [currentTime, setCurrentTime] = useState(0);
  // TODO: I'm using a ref so that the maybeStopAudio closure doesn't get stuck
  // with the initial value of isPlaying. Given that we also have a state,
  // isPlaying, it feels like there's a better way.
  const isPlayingSceneRef = useRef(false);

  // memoizing to prevent the useEffect from running on every render
  const sortedCommands = useMemo(() => {
    const normalized = commands.flatMap(command => {
      const { startTime, finishTime, ...rest } = command;

      const startCommand = {
        ...rest,
        time: sToMs(startTime),
        isTalking: !!rest.dialogue
      };
      const finishCommand = finishTime
        ? { ...rest, time: sToMs(finishTime), isTalking: false }
        : null;

      return finishCommand ? [startCommand, finishCommand] : [startCommand];
    });
    normalized.sort((a, b) => a.time - b.time);
    return normalized;
  }, [commands]);

  // an extra 500ms at the end to let the characters fade out (CSS transition
  const resetTime = sortedCommands.at(-1)!.time + 500;

  const audioLoaded = () => {
    setSceneIsReady(true);
  };

  const handlePlay = useCallback(() => {
    const pausedAt = pausedAtRef.current;
    const updateCurrentTime = () => {
      const time = Date.now() - startClocktimeRef.current;
      setCurrentTime(time);

      if (isPlayingSceneRef.current) {
        animationRef.current = window.requestAnimationFrame(updateCurrentTime);
      }
    };
    // TODO: if we manage the playing state in another module, we should not
    // need the early return here. It should not be possible for this to be
    // called at all if the scene is already playing.
    if (isPlaying || !sceneIsReady) return;
    setIsPlaying(true);
    isPlayingSceneRef.current = true;

    // when we paused, the startRef was the clock time when we started and
    // pausedAt was the currentTime (i.e. how long we've been playing). That
    // means to resume we need to set the startRef to the current time minus
    // the time we've already played.
    startClocktimeRef.current = Date.now() - pausedAt;
    updateCurrentTime();

    const audioStartDelay = sToMs(audio.startTime) - pausedAt;

    // @ts-expect-error it's not a node timer
    startTimerRef.current = setTimeout(() => {
      if (audioRef.current.paused) {
        void audioRef.current.play().then(() => {
          canPauseRef.current = true;

          // If the duration is Infinity, that means the duration is simply the
          // length of the file. However we need to actively stop the audio to
          // ensure that cleanup (i.e. resetAudio is called) )
          const effectiveDuration =
            duration === Infinity ? sToMs(audioRef.current.duration) : duration;

          // If the delay is positive, the setTimeout will have already waited
          // that amount of time. However, if it's negative, then the setTimeout
          // has no delay and we need to account for that when calculating how
          // much audio is left to play.
          const effectiveStartDelay = Math.min(0, audioStartDelay);
          const audioEndDelay = effectiveDuration + effectiveStartDelay;

          if (audioEndDelay < 0) {
            resetAudio();
            return;
          }
          // @ts-expect-error it's not a node timer
          finishTimerRef.current = setTimeout(() => {
            const endTimeStamp = sToMs(audio.finishTimestamp!); // it exists because duration is not Infinity
            const audioCurrentTime = sToMs(audioRef.current.currentTime);
            const remainingTime = endTimeStamp - audioCurrentTime;
            // For some reason, despite the setTimeout resolving at the right
            // time, the currentTime can be smaller than expected. That means
            // that if we pause now it will cut off the last part.
            if (remainingTime < 100) {
              // 100ms is arbitrary and may need to be adjusted if people still
              // notice the cut off

              resetAudio();
            } else {
              // @ts-expect-error it's not a node timer
              finishTimerRef.current = setTimeout(() => {
                resetAudio();
              }, remainingTime);
            }
          }, audioEndDelay);
        });
      }
    }, audioStartDelay);
  }, [audio, duration, isPlaying, resetAudio, sceneIsReady]);

  const handlePause = useCallback(() => {
    isPlayingSceneRef.current = false;
    pausedAtRef.current = currentTime;
    pauseAudio();
    pauseAnimation();
  }, [currentTime]);

  const handleStop = useCallback(() => {
    usedCommandsRef.current.clear();
    pauseAudio();
    pauseAnimation();
    audioRef.current.currentTime = audio.startTimestamp || 0;
    setCurrentTime(0);
    setIsPlaying(false);
    isPlayingSceneRef.current = false;
    setDialogue(initDialogue);
    setCharacters(initCharacters);
    setBackground(initBackground);
  }, [audio, initCharacters, initBackground]);

  const resetAnimation = useCallback(() => {
    usedCommandsRef.current.clear();
    startClocktimeRef.current = 0;
    setCurrentTime(0);
    setDialogue(initDialogue);
    setCharacters(initCharacters);
    setBackground(initBackground);
  }, [initCharacters, initBackground]);

  const resetScene = () => {
    setIsPlaying(false);
    isPlayingSceneRef.current = false;
    pausedAtRef.current = 0;
  };

  const onNotify = useCallback(
    (eventType: 'play' | 'pause' | 'stop') => {
      if (eventType === 'play') {
        handlePlay();
      } else if (eventType === 'pause') {
        handlePause();
      } else {
        handleStop();
      }
    },
    [handlePlay, handlePause, handleStop]
  );

  useEffect(() => {
    sceneSubject.attach(onNotify);
    return () => {
      sceneSubject.detach(onNotify);
    };
  }, [onNotify, sceneSubject]);

  useEffect(() => {
    if (isEmpty(sortedCommands)) return;

    sortedCommands.forEach((command, commandIndex) => {
      // Start command timeout
      if (
        currentTime > command.time &&
        !usedCommandsRef.current.has(commandIndex)
      ) {
        usedCommandsRef.current.add(commandIndex);
        if (command.background) setBackground(command.background);

        setDialogue(
          command.dialogue
            ? { ...command.dialogue, label: command.character }
            : initDialogue
        );

        setCharacters(prevCharacters => {
          const newCharacters = prevCharacters.map(character => {
            if (character.character === command.character) {
              return {
                ...character,
                position: command.position ?? character.position,
                opacity: command.opacity ?? character.opacity,
                isTalking: command.isTalking
              };
            }
            return character;
          });
          return newCharacters;
        });
      }
    });

    if (currentTime >= resetTime) {
      // resetAnimation only works if called AFTER the commands, otherwise the
      // commands will undo the reset.
      resetAnimation();
      resetScene();
    }
  }, [currentTime, resetTime, sortedCommands, resetAnimation]);

  useEffect(() => {
    return () => {
      clearTimeout(startTimerRef.current);
      clearTimeout(finishTimerRef.current);
      // @ts-expect-error cancelAnimationFrame accepts undefined, but TS doesn't
      // know that
      window.cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <Col lg={10} lgOffset={1} md={10} mdOffset={1}>
      <div
        className='scene-wrapper'
        style={{
          backgroundImage: `url("${backgrounds}/${background}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          aspectRatio: '16 / 9'
        }}
      >
        {!sceneIsReady ? (
          <Loader />
        ) : (
          <>
            {characters.map(
              (
                { character, position = {}, opacity = 1, isTalking = false },
                i
              ) => {
                return (
                  <Character
                    key={i}
                    name={character}
                    position={position}
                    opacity={opacity}
                    isTalking={isPlaying && isTalking}
                    sceneSubject={sceneSubject}
                  />
                );
              }
            )}

            {(alwaysShowDialogue || accessibilityOn) && (
              <div
                className={`scene-dialogue-wrap ${
                  dialogue.align ? `scene-dialogue-align-${dialogue.align}` : ''
                }`}
              >
                <div className='scene-dialogue-label'>{dialogue.label}</div>
                <div className='scene-dialogue-text'>{dialogue.text}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className='scene-controls'>
        <button
          className='scene-btn scene-play-btn'
          onClick={() => sceneSubject.notify(isPlaying ? 'pause' : 'play')}
        >
          {isPlaying ? (
            <>
              <span className='sr-only'>{t('buttons.pause')}</span>
              <FontAwesomeIcon icon={faCirclePause} size='3x' />
            </>
          ) : (
            <>
              <span className='sr-only'>{t('buttons.play')}</span>
              <FontAwesomeIcon icon={faCirclePlay} size='3x' />
            </>
          )}
        </button>

        {alwaysShowDialogue ? (
          <div className='scene-a11y-btn'></div>
        ) : (
          <button
            className='scene-btn scene-a11y-btn'
            aria-label={t('buttons.closed-caption')}
            aria-pressed={accessibilityOn}
            onClick={() => setAccessibilityOn(!accessibilityOn)}
          >
            <ClosedCaptionsIcon
              fill={
                accessibilityOn ? 'var(--tertiary-color)' : 'var(--gray-45)'
              }
            />
          </button>
        )}
      </div>
      <Spacer size='m' />
    </Col>
  );
}

Scene.displayName = 'Scene';

export default Scene;
