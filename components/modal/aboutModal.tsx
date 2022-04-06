import Modal from '.';
import React from 'react';

interface AboutModalProps {
  closeModal: () => void;
  isOpen: boolean;
}

export default function AboutModal({ closeModal, isOpen }: AboutModalProps) {
  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={'About'}
    >
      <>
        <span>
          {'Recreation of K2xL\'s '}
          <a
            className='underline'
            href='https://k2xl.com/games/psychopath2'
            rel='noreferrer'
            target='_blank'
          >
            Psychopath 2
          </a>
          .
        </span>
        <br/>
        <span>
          {'Source code can be found '}
          <a
            className='underline'
            href='https://github.com/sspenst/pathology'
            rel='noreferrer'
            target='_blank'
          >
            here
          </a>
          .
        </span>
        <br/>
        <span>
          {'Please '}
          <a
            className='underline'
            href='mailto:spencerspenst@gmail.com'
          >
            contact me
          </a>
          {' if you have any feedback!'}
        </span>
      </>
    </Modal>
  );
}
