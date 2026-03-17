import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';
import { Text } from 'react-native';
import Colors from '../constants/colors';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextProps {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState(Colors.gray);
  const [textColor, setTextColor] = useState(Colors.white);

  const showSnackbar = useCallback(
    (msg: string, type: SnackbarType = 'info') => {
      let backgroundColor = Colors.gray;
      let messageColor = Colors.white;

      switch (type) {
        case 'success':
          backgroundColor = Colors.lightGreen;
          messageColor = Colors.primary;
          break;
        case 'error':
          backgroundColor = Colors.extralightRed;
          messageColor = Colors.red;
          break;
        case 'warning':
          backgroundColor = Colors.lightYellow;
          messageColor = Colors.orange;
          break;
        case 'info':
          backgroundColor = Colors.primary;
          messageColor = Colors.blue;
          break;
      }

      setMessage(msg);
      setBgColor(backgroundColor);
      setTextColor(messageColor);
      setVisible(true);
    },
    [],
  );

  const onDismiss = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        style={{ backgroundColor: bgColor, zIndex: 9999, elevation: 9999 }}
      >
        <Text style={{ color: textColor }}>{message}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context.showSnackbar;
};
