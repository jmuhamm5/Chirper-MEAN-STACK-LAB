import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bp from 'body-parser';
import { generate } from 'shortid';

const dataPath = path.join(__dirname, 'data.json');

const base = '/api/chirps';

const app = express();

app
    .disable('x-powered-by')
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(bp.json())
    .use(bp.urlencoded({ extended: true }));

app.get(base, (req: express.Request, res: express.Response) => {
    fs.readFile(dataPath, 'utf-8', (err, f) => {
        res.send(f);
    });
});

app.post(base, (req: express.Request, res: express.Response) => {
    fs.readFile(dataPath, 'utf-8', (err, f) => {
        const fp = JSON.parse(f);
        const c = req.body;
        const id = generate();
        c.id = id;
        fp.push(c);
        fs.writeFile(dataPath, JSON.stringify(fp), (err) => {
            if (err) throw err;
            res.status(201).send(id).end();
        });
    });
});

app.get(`${base}/:id`, (req: express.Request, res: express.Response) => {
    fs.readFile(dataPath, 'utf-8', (err, f) => {
        const fp: Array<any> = JSON.parse(f);
        const found = fp.filter((chirp: any) => chirp.id === req.params.id);

        if (found.length !== 1) {
            res.status(404).end();
            return;
        }

        const chirp = JSON.stringify(found[0]);
        res.send(chirp).end();
    });
});

app.delete(`${base}/:id`, (req: express.Request, res: express.Response) => {
    fs.readFile(dataPath, 'utf-8', (err, f) => {
        const fp: Array<any> = JSON.parse(f);
        let foundIndex: number = -1;

        fp.map((chirp: any, i) => {
            if (chirp.id === req.params.id) {
                foundIndex = i;
            }
        });

        if (foundIndex === -1) {
            res.status(404).end();
            return;
        }

        fp.splice(foundIndex, 1);

        fs.writeFile(dataPath, JSON.stringify(fp), 'utf-8', (err) => {
            if (err) throw err;

            console.error(err);
            res.status(202).end();
        });
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000.');
});