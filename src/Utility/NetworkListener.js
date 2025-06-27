import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setConnectionInfo } from '../redux/slices/networkSlice';

const NetworkListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setConnectionInfo({
        isConnected: state.isConnected,
        connectionType: state.type,
      }));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default NetworkListener;
