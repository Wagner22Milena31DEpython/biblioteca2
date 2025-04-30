app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));
