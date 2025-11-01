import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
