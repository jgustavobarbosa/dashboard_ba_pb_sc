(function () {
  var DADOS = window.DADOS, T = DADOS.tribunais;
  var MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  var st = { trib: 'AGR', tema: 'SAUDE', ticket: 18000, share: 20 };

  var fmt = function (n) { return Math.round(n).toLocaleString('pt-BR'); };
  var pct = function (x, d) { return x.toFixed(d === undefined ? 1 : d).replace('.', ',') + '%'; };
  var brl = function (v) { return v >= 1e9 ? 'R$ ' + (v / 1e9).toFixed(2).replace('.', ',') + ' bi' : (v >= 1e6 ? 'R$ ' + (v / 1e6).toFixed(1).replace('.', ',') + ' mi' : 'R$ ' + fmt(v / 1e3) + ' mil'); };
  var mesLabel = function (i) { return i < 12 ? MES[i] + '/25' : MES[i - 12] + '/26'; };
  var $ = function (id) { return document.getElementById(id); };

  function niceTop(m) {
    var p = Math.pow(10, Math.floor(Math.log10(m)));
    var cs = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < cs.length; i++) { if (cs[i] * p >= m * 1.04) return cs[i] * p; }
    return 10 * p;
  }
  function wavg(list, k, w) { var s = 0, t = 0; list.forEach(function (d) { s += d[k] * d[w]; t += d[w]; }); return s / t; }
  function sumKey(list, k) { return list.reduce(function (a, d) { return a + d[k]; }, 0); }
  function agregado() {
    var L = [T.TJBA, T.TJPB, T.TJSC], o = { nome: 'Agrupado (3 tribunais)' };
    ['pend','pendLiq','baix','limDef','limIndef','ent','jul','proc','improc','homol','outros','sem'].forEach(function (k) { o[k] = sumKey(L, k); });
    o.tmPend = wavg(L, 'tmPend', 'pend'); o.tmPendLiq = wavg(L, 'tmPendLiq', 'pendLiq'); o.tmBaixa = wavg(L, 'tmBaixa', 'baix');
    o.tmJulg = wavg(L, 'tmJulg', 'jul'); o.iad = wavg(L, 'iad', 'ent'); o.congB = wavg(L, 'congB', 'pend'); o.congL = wavg(L, 'congL', 'pend');
    o.nov = T.TJBA.nov.map(function (v, i) { return v + T.TJPB.nov[i] + T.TJSC.nov[i]; });
    o.bx = T.TJBA.bx.map(function (v, i) { return v + T.TJPB.bx[i] + T.TJSC.bx[i]; });
    return o;
  }
  function atual() {
    if (st.tema === 'SP') return DADOS.saudePublica.TJBA;
    return st.trib === 'AGR' ? agregado() : T[st.trib];
  }
  function temDados() { return st.tema === 'SAUDE' || st.trib === 'TJBA'; }

  function pills(el, itens, chave) {
    el.innerHTML = itens.map(function (it) {
      return '<button class="pill" data-k="' + it[0] + '" aria-pressed="' + (st[chave] === it[0]) + '">' + it[1] + '</button>';
    }).join('');
    el.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () { st[chave] = b.getAttribute('data-k'); render(); };
    });
  }

  function kpi(l, v, s) { return '<div class="card kpi" style="gap:4px;padding:16px 18px"><div class="l muted">' + l + '</div><div class="v">' + v + '</div><div class="small muted">' + s + '</div></div>'; }

  function renderKpis(d) {
    var lim = d.limDef / (d.limDef + d.limIndef) * 100;
    $('kpis').innerHTML = [
      kpi('ENTRADAS EM 2026', fmt(d.ent), 'Casos novos'),
      kpi('BAIXADOS EM 2026', fmt(d.baix), 'Saídas'),
      kpi('JULGADOS EM 2026', fmt(d.jul), 'Primeiro julgamento em ' + fmt(d.tmJulg) + ' dias'),
      kpi('PENDENTES EM ' + DADOS.dataCorte, fmt(d.pend), fmt(d.pendLiq) + ' líquidos'),
      kpi('LIMINARES DEFERIDAS', fmt(d.limDef), fmt(d.limIndef) + ' indeferidas · ' + pct(lim) + ' deferidas'),
      kpi('TEMPO MÉDIO DO PENDENTE', fmt(d.tmPend) + ' dias', fmt(d.tmPendLiq) + ' dias no pendente líquido'),
      kpi('TEMPO MÉDIO DA 1ª BAIXA', fmt(d.tmBaixa) + ' dias', 'Média dos baixados em 2026'),
      kpi('ÍND. ATENDIMENTO À DEMANDA', pct(d.iad), 'Baixas em relação às entradas'),
      kpi('CONGESTIONAMENTO BRUTA', pct(d.congB), 'Em ' + DADOS.dataCorte),
      kpi('CONGESTIONAMENTO LÍQUIDA', pct(d.congL), 'Em ' + DADOS.dataCorte)
    ].join('');
  }

  function renderSerie(d) {
    var nov = d.nov, bx = d.bx, top = niceTop(Math.max.apply(null, nov.concat(bx)));
    var y = function (v) { return 270 - v / top * 240; };
    var x = function (i) { return 60 + i * (920 / 19); };
    var path = function (a) { return a.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '); };
    var s = '<line x1="60" x2="980" y1="270" y2="270" stroke="#4A6A88"/><text x="52" y="274" text-anchor="end" font-size="12" fill="#A7B9CB">0</text>';
    [1, 2, 3, 4].forEach(function (k) {
      var v = top * k / 4;
      s += '<line x1="60" x2="980" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#2B4A66" stroke-dasharray="3 5"/>' +
           '<text x="52" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="#A7B9CB">' + fmt(v) + '</text>';
    });
    [[0, 'jan 2025'], [3, 'abr 2025'], [6, 'jul 2025'], [9, 'out 2025'], [12, 'jan 2026'], [15, 'abr 2026'], [18, 'jul 2026']].forEach(function (m) {
      s += '<text x="' + x(m[0]).toFixed(0) + '" y="296" text-anchor="middle" font-size="12" fill="#A7B9CB">' + m[1] + '</text>';
    });
    s += '<path d="' + path(bx) + '" fill="none" stroke="#FFA94D" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
         '<path d="' + path(nov) + '" fill="none" stroke="#5EB1FF" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
         '<circle cx="980" cy="' + y(bx[19]).toFixed(1) + '" r="4.5" fill="#FFA94D"/><circle cx="980" cy="' + y(nov[19]).toFixed(1) + '" r="4.5" fill="#5EB1FF"/>';
    $('serie').innerHTML = s;
    $('serie').setAttribute('aria-label', 'Linhas de casos novos e baixados por mês, jan/2025 a ago/2026.');
    $('leg-nov').textContent = 'Novos · último mês ' + fmt(nov[19]);
    $('leg-bx').textContent = 'Baixados · último mês ' + fmt(bx[19]);
    $('meses').innerHTML = '<div class="h">Mês</div><div class="h r">Novos</div><div class="h r">Baixados</div><div class="h r">Saldo</div>' +
      nov.map(function (v, i) { var sd = v - bx[i]; return '<div>' + mesLabel(i) + '</div><div class="r">' + fmt(v) + '</div><div class="r">' + fmt(bx[i]) + '</div><div class="r">' + (sd > 0 ? '+' : '') + fmt(sd) + '</div>'; }).join('');
  }

  function renderJulgados(d) {
    var tot = d.proc + d.improc + d.homol + d.outros + d.sem;
    var segs = [['Procedência / provimento', d.proc, '#4CC38A'], ['Improcedência / desprovimento', d.improc, '#F27D7D'], ['Homologação de acordo', d.homol, '#5EB1FF'], ['Outros (com mérito)', d.outros, '#9AA8B8'], ['Sem mérito', d.sem, '#B79CFF']];
    $('jul-tit').textContent = 'Julgados em 2026: ' + fmt(d.jul);
    $('jul-tm').textContent = fmt(d.tmJulg);
    $('jul-bar').innerHTML = segs.map(function (s) { return '<div style="height:100%;width:' + (s[1] / tot * 100).toFixed(3) + '%;background:' + s[2] + '"></div>'; }).join('');
    $('jul-leg').innerHTML = segs.map(function (s) {
      return '<div style="display:flex;gap:10px;align-items:flex-start"><span style="width:14px;height:14px;border-radius:3px;flex:none;margin-top:3px;background:' + s[2] + '"></span><div><div style="font-size:13px;color:#C8D6E4">' + s[0] + '</div><div style="font-size:20px;font-weight:600">' + fmt(s[1]) + '</div><div class="small muted">' + pct(s[1] / tot * 100, 2) + '</div></div></div>';
    }).join('');
  }

  function renderValores() {
    var d = atual(), isSP = st.tema === 'SP';
    var shareF = isSP ? 1 : st.share / 100, casos = d.ent * shareF;
    var est8 = casos * st.ticket, estAno = est8 * 12 / 8;
    var ref = (st.trib === 'TJBA' || st.trib === 'TJSC') ? DADOS.referencias[st.trib] : null;
    $('tk-lbl').textContent = 'R$ ' + fmt(st.ticket);
    $('share-lbl').textContent = pct(st.share, 0);
    $('share-box').style.display = isSP ? 'none' : 'block';
    $('share-fixo').style.display = isSP ? 'block' : 'none';
    var box = function (l, v, s, cor) { return '<div class="inner" style="gap:4px"><div class="small muted" style="font-weight:600">' + l + '</div><div style="font-size:26px;font-weight:700;color:' + (cor || '#7FD8CE') + '">' + v + '</div><div class="small muted">' + s + '</div></div>'; };
    $('vals').innerHTML =
      box('CASOS NOVOS CONTRA O PODER PÚBLICO', fmt(casos), fmt(d.ent) + ' entradas em 2026 × ' + (isSP ? '100% (já é Saúde Pública)' : pct(st.share, 0))) +
      box('ESTIMATIVA EM 8 MESES (jan–ago/2026)', brl(est8), 'Casos novos × ticket de R$ ' + fmt(st.ticket)) +
      box('ESTIMATIVA ANUALIZADA', brl(estAno), 'Projeção linear de 8 para 12 meses') +
      (ref ? box('REFERÊNCIA PÚBLICA: ' + ref.rotulo.toUpperCase(), brl(ref.valor), 'Estimativa equivale a ' + pct(estAno / ref.valor * 100, 0) + ' da referência; ticket que fecharia a conta: R$ ' + fmt(ref.valor / (casos * 12 / 8)))
           : box('REFERÊNCIA PÚBLICA', 'n/d', 'Sem série atual para este recorte', '#A7B9CB'));
    $('sens').innerHTML = '<div class="h">Ticket</div><div class="h r">Estimativa em 8 meses</div><div class="h r">Anualizada</div>' +
      [10000, 18000, 30000, 60000].map(function (t) { return '<div>R$ ' + fmt(t) + '</div><div class="r">' + brl(casos * t) + '</div><div class="r">' + brl(casos * t * 12 / 8) + '</div>'; }).join('');
  }

  function renderComparativo() {
    var L = [T.TJBA, T.TJPB, T.TJSC], cores = ['#5EB1FF', '#FFA94D', '#7FD8CE'];
    var metrica = function (rot, k) {
      var m = Math.max.apply(null, L.map(function (t) { return t[k]; }));
      return '<div style="display:flex;flex-direction:column;gap:10px"><div style="font-size:13px;font-weight:600;color:#C8D6E4">' + rot + '</div>' +
        L.map(function (t, i) { return '<div style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>' + t.nome + '</span><strong>' + fmt(t[k]) + '</strong></div><div class="bar"><div style="width:' + (t[k] / m * 100).toFixed(2) + '%;background:' + cores[i] + '"></div></div></div>'; }).join('') + '</div>';
    };
    $('cmp').innerHTML = metrica('Entradas em 2026', 'ent') + metrica('Baixados em 2026', 'baix') + metrica('Julgados em 2026', 'jul') + metrica('Pendentes em ' + DADOS.dataCorte, 'pend');
    $('tbl').innerHTML = ['Tribunal', 'Entradas', 'Baixados', 'Julgados', 'Pendentes', 'Procedência (mérito)', '1º julgamento (dias)', 'Liminares deferidas'].map(function (h, i) { return '<div class="h' + (i ? ' r' : '') + '">' + h + '</div>'; }).join('') +
      L.map(function (t) {
        return '<div style="font-weight:600">' + t.nome + '</div><div class="r">' + fmt(t.ent) + '</div><div class="r">' + fmt(t.baix) + '</div><div class="r">' + fmt(t.jul) + '</div><div class="r">' + fmt(t.pend) + '</div><div class="r">' + pct(t.proc / (t.proc + t.improc) * 100) + '</div><div class="r">' + fmt(t.tmJulg) + '</div><div class="r">' + pct(t.limDef / (t.limDef + t.limIndef) * 100) + '</div>';
      }).join('');
  }

  function renderTjpb() {
    var box = $('tjpb-extra');
    var on = st.trib === 'TJPB' && st.tema === 'SAUDE';
    box.style.display = on ? 'flex' : 'none';
    if (!on) return;
    var p = T.TJPB, a25 = p.nov.slice(0, 12).reduce(function (a, v) { return a + v; }, 0);
    var limP = p.limDef / (p.limDef + p.limIndef) * 100, procP = p.proc / (p.proc + p.improc) * 100, acP = p.homol / p.jul * 100;
    var linhas = [
      ['Casos novos', fmt(p.ent) + ' em jan–ago/2026; ' + fmt(a25) + ' em 2025', '1.800 a 2.300 por ano', 'Diverge cerca de 3,5×. A faixa parece ser as 10 mil de 2014–2019 divididas por cinco anos, sem fonte própria. Usar o painel.'],
      ['Liminares deferidas', pct(limP) + ' (' + fmt(p.limDef) + ' de ' + fmt(p.limDef + p.limIndef) + ')', '73% (SUS) · 69,5% (planos)', 'Coerente. A fonte é média regional do Nordeste (CNJ), não específica do TJPB; não consegui abrir a página.'],
      ['Procedência final', pct(procP) + ' entre decisões de mérito', '84% (SUS) · 87% (planos)', 'Bases diferentes: o painel soma todas as ações; os 84% e 87% parecem ser de ações com liminar deferida. Não verificado.'],
      ['Acordos / conciliação', pct(acP, 2) + ' dos julgados (homologação de acordo)', 'abaixo de 1% (saúde pública)', 'Compatível: o painel mistura saúde pública e suplementar.'],
      ['NatJus', 'n/d no painel', '2.331 pareceres e notas técnicas', 'Não aparece na página do TJPB que consegui ler. Confirmar com o tribunal.']
    ];
    $('tjpb-tbl').innerHTML = ['Indicador', 'Painel CNJ (capturas)', 'Fonte complementar informada', 'Leitura'].map(function (h) { return '<div class="h">' + h + '</div>'; }).join('') +
      linhas.map(function (l) { return l.map(function (c, i) { return '<div' + (i === 0 ? ' style="font-weight:600"' : '') + '>' + c + '</div>'; }).join(''); }).join('');
  }

  function render() {
    renderTjpb();
    pills($('f-trib'), [['AGR', 'Agrupado'], ['TJBA', 'TJBA'], ['TJPB', 'TJPB'], ['TJSC', 'TJSC']], 'trib');
    pills($('f-tema'), [['SAUDE', 'Saúde'], ['SP', 'Saúde Pública']], 'tema');
    $('ctx').textContent = (st.trib === 'AGR' ? 'Agrupado' : st.trib) + ' · ' + (st.tema === 'SP' ? 'Saúde Pública' : 'Saúde');
    var ok = temDados();
    $('sem-dados').style.display = ok ? 'none' : 'block';
    $('com-dados').style.display = ok ? 'flex' : 'none';
    if (ok) { var d = atual(); renderKpis(d); renderSerie(d); renderJulgados(d); renderValores(); }
  }

  $('tk').oninput = function (e) { st.ticket = Number(e.target.value); renderValores(); };
  $('share').oninput = function (e) { st.share = Number(e.target.value); renderValores(); };
  renderComparativo();
  render();
})();
