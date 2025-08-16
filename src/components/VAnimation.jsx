import React, { useEffect, useState } from 'react';

const fonts = [
  'Arial Black, Arial Bold, Gadget, sans-serif',
  '"Times New Roman", Times, serif',
  '"Courier New", Courier, monospace',
  '"Comic Sans MS", cursive, sans-serif',
  '"Lucida Console", Monaco, monospace',
  '"Impact", Charcoal, sans-serif',
  '"Brush Script MT", cursive',
  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
  '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  '"Trebuchet MS", Helvetica, sans-serif',
];

const VAnimation = () => {
  const [show, setShow] = useState(true);
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 100); // Change font every 100ms

    const timer = setTimeout(() => setShow(false), 1500); // Show for 1.5s

    return () => {
      clearInterval(fontInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#fff', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#222', // changed from #4F46E5
            marginBottom: '-1.5rem',
            letterSpacing: '0.1em',
            animation: 'lets-fadeup 1s ease'
          }}
        >
          Lets
        </span>
        <span style={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: '#222', // changed from #4F46E5
          fontFamily: fonts[fontIndex],
          transition: 'font-family 0.08s',
          animation: 'v-bounce 1.5s ease'
        }}>
          V
        </span>
      </div>
      <style>
        {`
          @keyframes v-bounce {
            0% { transform: scale(0.5) rotate(-30deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes lets-fadeup {
            0% { opacity: 0; transform: translateY(30px);}
            60% { opacity: 1; transform: translateY(-5px);}
            100% { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default VAnimation;
