// Dados do dashboard. Para trocar pelos dados do datalake (maestro), edite só este arquivo.
// Fonte atual: capturas de tela do painel de saúde do CNJ, dados até 31/08/2026.
// Séries: 20 meses, jan/2025 a ago/2026. 2026 conferido com os totais do painel;
// pontos de 2025 sem rótulo no print foram lidos do gráfico (aproximados).
window.DADOS = {
  dataCorte: '31/08/2026',
  tribunais: {
    TJBA: { nome: 'TJBA', pend: 64596, pendLiq: 63467, baix: 40408, limDef: 12407, limIndef: 6034, tmPend: 482, tmPendLiq: 463, tmBaixa: 313, ent: 45713, iad: 89.1, congB: 51.2, congL: 50.7, jul: 45790, tmJulg: 270, proc: 18868, improc: 17472, homol: 845, outros: 1893, sem: 6712,
      nov: [3757,5170,5225,4950,5180,4773,6499,6261,6690,6400,5596,4790,4300,4850,6383,5812,6030,5094,6857,6387],
      bx:  [3225,4717,5095,4416,4196,4500,6058,5562,6050,6040,4987,4170,3441,4357,5703,5034,5761,4412,6316,5384] },
    TJPB: { nome: 'TJPB', pend: 9582, pendLiq: 8919, baix: 6158, limDef: 1919, limIndef: 866, tmPend: 383, tmPendLiq: 233, tmBaixa: 498, ent: 6165, iad: 100.1, congB: 52.0, congL: 50.2, jul: 6767, tmJulg: 401, proc: 2664, improc: 1729, homol: 159, outros: 589, sem: 1626,
      nov: [435,708,603,625,734,577,702,690,697,715,625,631,464,622,885,789,876,741,982,806],
      bx:  [336,674,580,563,735,612,741,665,755,728,637,570,372,605,917,793,995,662,1077,737] },
    TJSC: { nome: 'TJSC', pend: 19589, pendLiq: 18472, baix: 13788, limDef: 3267, limIndef: 3438, tmPend: 512, tmPendLiq: 400, tmBaixa: 340, ent: 13398, iad: 101.0, congB: 49.0, congL: 47.6, jul: 15426, tmJulg: 304, proc: 5123, improc: 4615, homol: 168, outros: 2134, sem: 3386,
      nov: [1042,1706,1693,1700,1788,1666,1895,1672,1820,1853,1503,1583,1277,1724,2197,1832,1886,1840,1930,712],
      bx:  [1000,2005,1976,1698,1758,1697,1885,1735,1954,1855,1547,1218,864,1720,2048,1767,1926,1984,2126,1353] }
  },
  // Saúde Pública: só o TJBA foi capturado.
  saudePublica: {
    TJBA: { nome: 'TJBA · Saúde Pública', pend: 22817, pendLiq: 22410, baix: 7979, limDef: 4650, limIndef: 1561, tmPend: 672, tmPendLiq: 657, tmBaixa: 674, ent: 9132, iad: 83.5, congB: 66.7, congL: 66.3, jul: 10077, tmJulg: 563, proc: 4936, improc: 2213, homol: 72, outros: 265, sem: 2591,
      nov: [695,856,901,899,968,947,1087,1152,1158,1230,1074,1041,946,963,1272,1095,1134,1060,1362,1300],
      bx:  [554,645,865,749,740,847,806,835,867,1001,852,685,510,738,1089,936,1170,950,1345,1241] }
  },
  // Gasto público divulgado por governos/órgãos de controle (valores em R$). Não somar: anos e bases diferem.
  referencias: {
    TJBA: { valor: 458e6, rotulo: 'Sesab 2025' },
    TJSC: { valor: 749e6, rotulo: 'Governo de SC 2024' }
  }
};
