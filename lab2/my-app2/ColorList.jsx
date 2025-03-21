import React, { useState } from 'react';

const ColorList = ({ colors }) => {
  const [activeColor, setActiveColor] = useState(null);

  const handleColorClick = (color) => {
    setActiveColor(color);
  };

  return (
    <div>
      <h2>Color List</h2>
      <div>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorClick(color)}
            style={{
              color: color,
              cursor: 'pointer',
              padding: '10px',
            }}
            className={activeColor === color ? 'active' : ''}
          >
            {color}
          </div>
        ))}
      </div>
      <p>Active Color: {activeColor || 'None'}</p>
    </div>
  );
};

export default ColorList;
