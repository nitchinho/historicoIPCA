import express from 'express';
import { buscaPorAno, buscaPorId, buscaTodos, calculoReajuste, validaErro } from './servicos/servicos.js'

const app = express();

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const dataInicioMes = parseInt(req.query.mesInicio);
    const dataInicioAno = parseInt(req.query.anoInicio);
    const dataFinalMes = parseInt(req.query.mesFinal);
    const dataFinalAno = parseInt(req.query.anoFinal);

    if (validaErro(valor, dataInicioMes, dataInicioAno, dataFinalMes, dataFinalAno)) {
        res.status(400).json({ erro: 'Dados Inválidos' });
        return;
    }

    const resultado = calculoReajuste(valor, dataInicioMes, dataInicioAno, dataFinalMes, dataFinalAno);
    res.json({ resultado: resultado });
});

app.get('/historicoIPCA', (req, res) => {
    const ano = parseInt(req.query.ano);
    if (isNaN(ano)) {
        res.json(buscaTodos());
    } else {
        const resultado = buscaPorAno(ano);
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ erro: 'Nenhum histórico para o ano especificado foi encontrado' });
        }
    }
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(404).json({ erro: 'ID Inválido' });
        return;
    }
    const el = buscaPorId(id);
    if (el) {
        res.json(el);
    } else {
        res.status(404).json({ erro: 'Elemento não encontrado' });
    }
});


app.listen(8080, () => {
    console.log('Servidor Iniciado na Porta 8080');
})