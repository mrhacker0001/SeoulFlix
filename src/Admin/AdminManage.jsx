import { useEffect, useState } from 'react';
import { apiGet, apiPut, apiDelete } from '../api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

export default function AdminManage() {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', thumbnail: '', lang: '' });
  const [toast, setToast] = useState({ open: false, msg: '', type: 'success' });

  

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/api/dramas');
      setDramas(data);
    } catch (e) {
      setToast({ open: true, msg: 'Ma\'lumotlarni yuklab bo\'lmadi', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (d) => {
    setEditingId(d.id);
    setForm({ title: d.title || '', description: d.description || '', thumbnail: d.thumbnail || '', lang: d.lang || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', thumbnail: '', lang: '' });
  };

  const saveEdit = async (id) => {
    try {
      if (!form.title.trim() || !form.description.trim() || !form.thumbnail.trim()) {
        setToast({ open: true, msg: "Maydonlar to'liq to'ldirilishi kerak", type: 'warning' });
        return;
      }
      await apiPut(`/api/dramas/${id}`, form);
      setToast({ open: true, msg: 'Saqlandi', type: 'success' });
      cancelEdit();
      await load();
    } catch (e) {
      setToast({ open: true, msg: 'Saqlashda xatolik', type: 'error' });
    }
  };

  const removeDrama = async (id) => {
    if (!window.confirm('Ushbu dramani o\'chirasizmi?')) return;
    try {
      await apiDelete(`/api/dramas/${id}`);
      setToast({ open: true, msg: 'O\'chirildi', type: 'success' });
      await load();
    } catch (e) {
      setToast({ open: true, msg: 'O\'chirishda xatolik', type: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Admin: Dramalarni boshqarish</Typography>

      {loading ? (
        <Typography>Yuklanmoqda...</Typography>
      ) : (
        <Grid container spacing={2}>
          {dramas.map((d) => (
            <Grid item xs={12} md={6} key={d.id}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  {editingId === d.id ? (
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <TextField label="Nomi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      <TextField label="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} />
                      <TextField label="Rasm (URL)" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
                      <TextField label="Til" value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })} />
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{d.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{d.description}</Typography>
                      <Typography variant="caption" color="text.secondary">Til: {d.lang || '—'}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">👍 {typeof d.likes === 'number' ? d.likes : 0}</Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  {editingId === d.id ? (
                    <>
                      <Button variant="contained" onClick={() => saveEdit(d.id)}>Saqlash</Button>
                      <Button onClick={cancelEdit}>Bekor qilish</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outlined" onClick={() => startEdit(d)}>Tahrirlash</Button>
                      <Button color="error" onClick={() => removeDrama(d.id)}>O'chirish</Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.type} sx={{ width: '100%' }}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
