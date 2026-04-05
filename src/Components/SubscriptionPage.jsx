import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const tiers = [
    {
        title: 'Bepul',
        price: '0',
        description: 'Siz hozir ushbu tarifdasiz',
        features: [
            "Oyiga 4 ta qism ko'rish",
            'Reklama bilan tomosha qilish',
            'Standart sifat',
        ],
        notIncluded: [
            "VIP kanalga a'zolik",
            'Eksklyuziv dramalar',
        ],
        buttonText: 'Hozirgi tarif',
        buttonVariant: 'outlined',
    },
    {
        title: '1 Oylik',
        subheader: 'Eng ommabop',
        price: '25,999',
        description: 'Boshlash uchun ajoyib tanlov',
        features: [
            '10 ta yangi qismga kirish',
            'Mutlaqo reklamasiz',
            'Yuqori sifat (Full HD)',
            "VIP kanalga a'zolik",
        ],
        buttonText: 'Sotib olish',
        buttonVariant: 'contained',
    },
    {
        title: '3 Oylik',
        price: '69,999',
        description: "Ko'proq drama, ko'proq foyda",
        features: [
            '2 ta hit dramadan 60 ta qism',
            'Mutlaqo reklamasiz',
            'Eng yuqori sifat',
            'VIP kanal va guruh',
        ],
        buttonText: 'Sotib olish',
        buttonVariant: 'contained',
    },
    {
        title: '1 Yillik',
        subheader: 'Eng foydali',
        price: '259,999',
        description: 'Haqiqiy drama ixlosmandlari uchun',
        features: [
            'Oyiga 5 ta dramani tugatish',
            'Yil davomida cheksiz kirish',
            'Eksklyuziv yordam',
            'Barcha VIP imtiyozlar',
        ],
        buttonText: 'Sotib olish',
        buttonVariant: 'contained',
    },
];

export default function SubscriptionPage() {
    return (
        <Box sx={{ background: '#0d0d0d', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: '#fff' }}
                    >
                        Premium bilan cheklovlarni unuting
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#aaa' }}>
                        Sevimli dramalaringizni reklamasiz va birinchilardan bo'lib tomosha qiling
                    </Typography>
                </Box>

                <Grid container spacing={3} alignItems="stretch">
                    {tiers.map((tier) => (
                        <Grid item key={tier.title} xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                            <Card
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    border: '1px solid #333',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 14px 30px rgba(255,23,68,0.18)',
                                        borderColor: '#ff1744',
                                    },
                                }}
                            >
                                <CardHeader
                                    title={tier.title}
                                    titleTypographyProps={{ align: 'center', fontWeight: 'bold' }}
                                    sx={{ borderBottom: '1px solid #333' }}
                                />

                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    {tier.subheader ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                            <Chip
                                                label={tier.subheader}
                                                sx={{
                                                    background: '#ff1744',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ height: 32, mb: 2 }} />
                                    )}

                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            {tier.price}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            so'm
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        align="center"
                                        sx={{ mb: 2, color: '#bbb', minHeight: 40 }}
                                    >
                                        {tier.description}
                                    </Typography>

                                    <Divider sx={{ borderColor: '#333', mb: 1 }} />

                                    <List sx={{ flexGrow: 1 }}>
                                        {tier.features.map((feature) => (
                                            <ListItem key={feature} sx={{ py: 0.5, px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CheckCircleIcon sx={{ color: '#ff1744' }} />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} />
                                            </ListItem>
                                        ))}

                                        {tier.notIncluded?.map((feature) => (
                                            <ListItem key={feature} sx={{ py: 0.5, px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CancelIcon sx={{ color: '#777' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature}
                                                    primaryTypographyProps={{ sx: { color: '#777' } }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>

                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant={tier.buttonVariant}
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRadius: 2,
                                            ...(tier.buttonVariant === 'contained'
                                                ? {
                                                    background: '#ff1744',
                                                    color: '#fff',
                                                    '&:hover': { background: '#d50000' },
                                                }
                                                : {
                                                    borderColor: '#ff1744',
                                                    color: '#ff1744',
                                                    '&:hover': {
                                                        borderColor: '#ff1744',
                                                        background: 'rgba(255,23,68,0.08)',
                                                    },
                                                }),
                                        }}
                                        href={tier.title === 'Bepul' ? '#' : 'https://t.me/premium_seoulflix'}
                                    >
                                        {tier.buttonText}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
