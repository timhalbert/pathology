export default function CreatorSelect(props) {
  const buttons = [];

  for (let i = 0; i < props.creators.length; i++) {
    const creator = props.creators[i];

    buttons.push(
      <button
        key={i} className={`border-2 font-semibold`}
        onClick={() => props.setCreatorId(creator._id)}
        style={{
          width: '200px',
          height: '100px',
          verticalAlign: 'top',
        }}>
        {creator.name}
      </button>
    );
  }

  return (
    <div>
      {buttons}
    </div>
  );
}