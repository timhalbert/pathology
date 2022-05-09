import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/appContext';
import Control from '../../models/control';
import GameLayout from '../../components/level/gameLayout';
import Level from '../../models/db/level';
import LevelDataType from '../../constants/levelDataType';
import LevelDataTypeModal from '../../components/modal/levelDataTypeModal';
import LinkInfo from '../../models/linkInfo';
import Page from '../../components/page';
import SizeModal from '../../components/modal/sizeModal';
import cloneLevel from '../../helpers/cloneLevel';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';

export default function Edit() {
  const { isLoading, user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [level, setLevel] = useState<Level>();
  const [levelDataType, setLevelDataType] = useState(LevelDataType.Default);
  const router = useRouter();
  const { setIsLoading } = useContext(AppContext);
  const { id } = router.query;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, router, user]);

  const getLevel = useCallback(() => {
    if (!id) {
      return;
    }

    fetch(`/api/level/${id}`, {
      method: 'GET',
    })
    .then(async res => {
      if (res.status === 200) {
        setLevel(await res.json());
      } else {
        throw res.text();
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching level');
    });
  }, [id]);

  useEffect(() => {
    getLevel();
  }, [getLevel]);

  useEffect(() => {
    setIsLoading(!level);
  }, [level, setIsLoading]);

  if (!id || !level) {
    return null;
  }

  function onClick(index: number) {
    setLevel(prevLevel => {
      if (!prevLevel) {
        return prevLevel;
      }

      const level = cloneLevel(prevLevel);
      level.data = level.data.substring(0, index) + levelDataType + level.data.substring(index + 1);
      return level;
    });
  }

  return (
    <Page
      folders={[
        new LinkInfo('Create', '/create'),
        new LinkInfo(level.worldId.name, `/create/${level.worldId._id}`),
      ]}
      title={level.name}
    >
      <>
        <GameLayout
          controls={[
            new Control(() => setIsModalOpen(true), 'Draw'),
            new Control(() => setLevelDataType(LevelDataType.Default), 'Erase'),
            new Control(() => setIsSizeOpen(true), 'Size'),
          ]}
          level={level}
          onClick={onClick}
        />
        <LevelDataTypeModal
          closeModal={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          levelDataType={levelDataType}
          onChange={(e) => setLevelDataType(e.currentTarget.value)}
        />
        <SizeModal
          closeModal={() => setIsSizeOpen(false)}
          isOpen={isSizeOpen}
          level={level}
          setLevel={setLevel}
        />
      </>
    </Page>
  );
}