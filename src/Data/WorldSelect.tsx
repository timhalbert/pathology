import { useCallback, useEffect } from 'react';
import React from 'react';
import World from '../DataModels/Psychopath/World';
import Color from '../Constants/Color';

interface WorldSelectProps {
  goToUniverseSelect: () => void;
  setWorldId: (worldId: string | undefined) => void;
  worlds: World[];
}

export default function WorldSelect(props: WorldSelectProps) {
  const goToUniverseSelect = props.goToUniverseSelect;

  const handleKeyDown = useCallback(event => {
    if (event.code === 'Escape') {
      goToUniverseSelect();
    }
  }, [goToUniverseSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const buttons = [];

  for (let i = 0; i < props.worlds.length; i++) {
    const world = props.worlds[i];
    const color = world.inPathology ? Color.SelectComplete : Color.TextDefault;

    buttons.push(
      <button
        key={i} className={'border-2 font-semibold'}
        onClick={() => props.setWorldId(world._id)}
        style={{
          width: '200px',
          height: '100px',
          verticalAlign: 'top',
          borderColor: color,
          color: color,
        }}>
        {world.name}
        <br/>
        {world.psychopathId}
      </button>
    );
  }

  return (
    <div>
      {buttons}
    </div>
  );
}
