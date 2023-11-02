import historicoInflacao from '../dados/dados.js'

export const buscaTodos = () => {
    return historicoInflacao;
}

export const buscaPorId = (id) => {
    const idHistorico = parseInt(id);
    const historico = historicoInflacao.find(historico => historico.id === idHistorico);

    return historico;
};

export const buscaPorAno = (ano) => {
    const anoHistorico = parseInt(ano);
    const historico = historicoInflacao.filter(historico => historico.ano === anoHistorico);

    return historico;
};

export const calculoReajuste = (valor, dataInicioMes, dataInicioAno, dataFinalMes, dataFinalAno) => {
    const historicoFilter = historicoInflacao.filter(historico => {
        if (dataInicioAno === dataFinalAno) {
            return historico.ano === dataInicioAno && historico.mes >= dataInicioMes && historico.mes <= dataFinalMes;
        } else {
            return (
                (historico.ano === dataInicioAno && historico.mes >= dataInicioMes) ||
                (historico.ano > dataInicioAno && historico.ano < dataInicioAno) ||
                (historico.ano === dataInicioAno && historico.mes <= dataFinalMes)
            );
        }
    });

    let taxasMensais = 1;
    for (const el of historicoFilter) {
        taxasMensais *= (el.ipca / 100) + 1;
    };

    const resultado = valor * taxasMensais;
    return parseFloat(resultado.toFixed(2));
};

export const validaErro = (valor, dataInicioAno, dataInicioMes, dataFinalAno, dataFinalMes) => {
    const limiteAnoFinal = historicoInflacao[historicoInflacao.length - 1].ano;
    const limiteAnoInicio = historicoInflacao[0].ano;
    const limiteMesFinal = historicoInflacao[historicoInflacao.length - 1].mes;
    if (
        isNaN(valor) ||

        isNaN(dataFinalAno) ||
        isNaN(dataFinalMes) ||

        isNaN(dataInicioAno) ||
        isNaN(dataInicioMes) ||

        dataInicioMes < 1 ||
        dataInicioMes > 12 ||

        dataInicioAno < limiteAnoInicio ||
        dataInicioAno > limiteAnoFinal ||

        dataFinalMes < 1 ||
        dataFinalMes > 12 ||

        dataFinalAno < limiteAnoInicio ||
        dataFinalAno > limiteAnoFinal ||
        dataFinalAno < dataInicioAno ||

        (dataFinalAno === limiteAnoFinal && dataFinalMes > limiteMesFinal) ||
        (dataFinalAno === dataInicioAno && dataFinalMes < dataInicioMes)
    ) {
        return true;
    } else {
        return false;
    }
};



