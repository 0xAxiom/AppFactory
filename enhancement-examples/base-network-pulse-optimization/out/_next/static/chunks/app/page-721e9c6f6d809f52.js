(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [974],
  {
    4389: (e, s, a) => {
      Promise.resolve().then(a.bind(a, 7322));
    },
    7322: (e, s, a) => {
      'use strict';
      (a.r(s), a.d(s, { default: () => u }));
      var t = a(5155),
        r = a(8661),
        f = a.n(r),
        l = a(2115),
        c = a(9559),
        d = a(5870),
        n = a(2056),
        i = a(6154),
        x = a(906),
        o = a(6983),
        m = a(1524),
        b = a(5710),
        j = a(9068),
        h = a(5707),
        g = a(2529);
      function u() {
        var e;
        let s,
          [a, r] = (0, l.useState)(10),
          [u, p] = (0, l.useState)(!0),
          [N, v] = (0, l.useState)(75),
          [y, w] = (0, l.useState)('tps'),
          [k, M] = (0, l.useState)(!0),
          [A, C] = (0, l.useState)(!1),
          [D, P] = (0, l.useState)(!1),
          [S, T] = (0, l.useState)({
            tps: Math.floor(50 * Math.random()) + 20,
            gasPrice: Math.floor(20 * Math.random()) + 5,
            blockTime: Math.floor(5 * Math.random()) + 2,
            validators: 147,
            uptime: 99.97,
          });
        (0, l.useEffect)(() => {
          if (!u) return;
          let e = setInterval(() => {
            T((e) => ({
              tps: Math.floor(50 * Math.random()) + 20,
              gasPrice: Math.floor(20 * Math.random()) + 5,
              blockTime: Math.floor(5 * Math.random()) + 2,
              validators: e.validators + Math.floor(3 * Math.random()) - 1,
              uptime: 99.9 + 0.09 * Math.random(),
            }));
          }, 1e3 * a);
          return () => clearInterval(e);
        }, [u, a]);
        let [E, R] = (0, l.useState)('standard');
        return (0, t.jsxs)('div', {
          className:
            "jsx-cf4ad6ff363bf3 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-['Inter']",
          children: [
            (0, t.jsx)('header', {
              className:
                'jsx-cf4ad6ff363bf3 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm',
              children: (0, t.jsx)('div', {
                className: 'jsx-cf4ad6ff363bf3 max-w-7xl mx-auto px-4 py-6',
                children: (0, t.jsxs)('div', {
                  className:
                    'jsx-cf4ad6ff363bf3 flex items-center justify-between',
                  children: [
                    (0, t.jsxs)('div', {
                      className: 'jsx-cf4ad6ff363bf3',
                      children: [
                        (0, t.jsx)('h1', {
                          className:
                            'jsx-cf4ad6ff363bf3 text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
                          children: 'Base Network Pulse',
                        }),
                        (0, t.jsx)('p', {
                          className: 'jsx-cf4ad6ff363bf3 text-gray-400 mt-1',
                          children:
                            'Real-time Base L2 network monitoring and optimization',
                        }),
                        (0, t.jsx)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 text-sm text-blue-400 font-medium mt-2',
                          children: '\uD83D\uDE80 Powered by AgentSkills',
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 flex items-center space-x-4',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2',
                          children: [
                            (0, t.jsx)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 w-2 h-2 bg-green-400 rounded-full animate-pulse',
                            }),
                            (0, t.jsx)('span', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                              children: 'Live',
                            }),
                          ],
                        }),
                        (0, t.jsx)('button', {
                          onClick: () => window.location.reload(),
                          title: 'Manual Refresh',
                          className:
                            'jsx-cf4ad6ff363bf3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors',
                          children: (0, t.jsx)(c.A, { className: 'h-4 w-4' }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
            (0, t.jsxs)('div', {
              className: 'jsx-cf4ad6ff363bf3 max-w-7xl mx-auto px-4 py-8',
              children: [
                (0, t.jsxs)('div', {
                  className:
                    'jsx-cf4ad6ff363bf3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
                  children: [
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 mb-4',
                          children: [
                            (0, t.jsx)(d.A, {
                              className: 'h-5 w-5 text-blue-400',
                            }),
                            (0, t.jsx)('h3', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-lg font-semibold',
                              children: 'Refresh Settings',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3 space-y-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center justify-between',
                              children: [
                                (0, t.jsx)('span', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                                  children: 'Auto-refresh',
                                }),
                                (0, t.jsx)('button', {
                                  onClick: () => p(!u),
                                  className:
                                    'jsx-cf4ad6ff363bf3 ' +
                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors '.concat(
                                      u ? 'bg-blue-600' : 'bg-gray-600'
                                    ),
                                  children: (0, t.jsx)('span', {
                                    className:
                                      'jsx-cf4ad6ff363bf3 ' +
                                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform '.concat(
                                        u ? 'translate-x-6' : 'translate-x-1'
                                      ),
                                  }),
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className: 'jsx-cf4ad6ff363bf3',
                              children: [
                                (0, t.jsxs)('label', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 block text-sm text-gray-300 mb-2',
                                  children: ['Interval: ', a, 's'],
                                }),
                                (0, t.jsx)('input', {
                                  type: 'range',
                                  min: '5',
                                  max: '60',
                                  value: a,
                                  onChange: (e) => r(Number(e.target.value)),
                                  className:
                                    'jsx-cf4ad6ff363bf3 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 mb-4',
                          children: [
                            (0, t.jsx)(n.A, {
                              className: 'h-5 w-5 text-yellow-400',
                            }),
                            (0, t.jsx)('h3', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-lg font-semibold',
                              children: 'Alert Threshold',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3',
                          children: [
                            (0, t.jsxs)('label', {
                              className:
                                'jsx-cf4ad6ff363bf3 block text-sm text-gray-300 mb-2',
                              children: ['TPS Alert: ', N],
                            }),
                            (0, t.jsx)('input', {
                              type: 'range',
                              min: '10',
                              max: '100',
                              value: N,
                              onChange: (e) => v(Number(e.target.value)),
                              className:
                                'jsx-cf4ad6ff363bf3 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider',
                            }),
                            S.tps > N &&
                              (0, t.jsxs)('div', {
                                className:
                                  'jsx-cf4ad6ff363bf3 mt-2 text-xs text-red-400 flex items-center space-x-1',
                                children: [
                                  (0, t.jsx)(n.A, { className: 'h-3 w-3' }),
                                  (0, t.jsx)('span', {
                                    className: 'jsx-cf4ad6ff363bf3',
                                    children: 'High TPS detected!',
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 mb-4',
                          children: [
                            (0, t.jsx)(i.A, {
                              className: 'h-5 w-5 text-purple-400',
                            }),
                            (0, t.jsx)('h3', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-lg font-semibold',
                              children: 'Gas Calculator',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3 space-y-3',
                          children: [
                            (0, t.jsxs)('select', {
                              value: E,
                              onChange: (e) => R(e.target.value),
                              className:
                                'jsx-cf4ad6ff363bf3 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm',
                              children: [
                                (0, t.jsx)('option', {
                                  value: 'low',
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: 'Low Priority',
                                }),
                                (0, t.jsx)('option', {
                                  value: 'standard',
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: 'Standard',
                                }),
                                (0, t.jsx)('option', {
                                  value: 'high',
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: 'High Priority',
                                }),
                                (0, t.jsx)('option', {
                                  value: 'ultra',
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: 'Ultra Fast',
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-lg font-mono text-blue-400',
                              children: [
                                ((e = E),
                                Math.round(
                                  S.gasPrice *
                                    ({
                                      low: 1,
                                      standard: 1.2,
                                      high: 1.5,
                                      ultra: 2,
                                    }[e] || 1.2)
                                )),
                                ' gwei',
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-xs text-gray-400',
                              children: ['Base: ', S.gasPrice, ' gwei'],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 mb-4',
                          children: [
                            (0, t.jsx)(d.A, {
                              className: 'h-5 w-5 text-green-400',
                            }),
                            (0, t.jsx)('h3', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-lg font-semibold',
                              children: 'Display Mode',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3 space-y-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center justify-between',
                              children: [
                                (0, t.jsx)('span', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                                  children: 'Compact View',
                                }),
                                (0, t.jsx)('button', {
                                  onClick: () => P(!D),
                                  className:
                                    'jsx-cf4ad6ff363bf3 ' +
                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors '.concat(
                                      D ? 'bg-green-600' : 'bg-gray-600'
                                    ),
                                  children: (0, t.jsx)('span', {
                                    className:
                                      'jsx-cf4ad6ff363bf3 ' +
                                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform '.concat(
                                        D ? 'translate-x-6' : 'translate-x-1'
                                      ),
                                  }),
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center justify-between',
                              children: [
                                (0, t.jsx)('span', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                                  children: 'Show Alerts',
                                }),
                                (0, t.jsx)('button', {
                                  onClick: () => M(!k),
                                  className:
                                    'jsx-cf4ad6ff363bf3 ' +
                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors '.concat(
                                      k ? 'bg-yellow-600' : 'bg-gray-600'
                                    ),
                                  children: (0, t.jsx)('span', {
                                    className:
                                      'jsx-cf4ad6ff363bf3 ' +
                                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform '.concat(
                                        k ? 'translate-x-6' : 'translate-x-1'
                                      ),
                                  }),
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center justify-between',
                              children: [
                                (0, t.jsx)('span', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                                  children: 'Sound Alerts',
                                }),
                                (0, t.jsx)('button', {
                                  onClick: () => C(!A),
                                  className:
                                    'jsx-cf4ad6ff363bf3 ' +
                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors '.concat(
                                      A ? 'bg-purple-600' : 'bg-gray-600'
                                    ),
                                  children: (0, t.jsx)('span', {
                                    className:
                                      'jsx-cf4ad6ff363bf3 ' +
                                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform '.concat(
                                        A ? 'translate-x-6' : 'translate-x-1'
                                      ),
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)('div', {
                  className:
                    'jsx-cf4ad6ff363bf3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
                  children: [
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center justify-between mb-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-2',
                              children: [
                                (0, t.jsx)(x.A, {
                                  className: 'h-5 w-5 text-blue-400',
                                }),
                                (0, t.jsx)('h3', {
                                  className: 'jsx-cf4ad6ff363bf3 font-semibold',
                                  children: 'TPS',
                                }),
                              ],
                            }),
                            (0, t.jsx)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 ' +
                                'text-2xl font-bold '.concat(
                                  (s = S.tps) > N
                                    ? 'text-red-400'
                                    : s > 0.8 * N
                                      ? 'text-yellow-400'
                                      : 'text-green-400'
                                ),
                              children: S.tps,
                            }),
                          ],
                        }),
                        (0, t.jsx)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 w-full bg-gray-700 rounded-full h-2',
                          children: (0, t.jsx)('div', {
                            style: {
                              width: ''.concat((S.tps / 100) * 100, '%'),
                            },
                            className:
                              'jsx-cf4ad6ff363bf3 bg-blue-400 h-2 rounded-full transition-all duration-500',
                          }),
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center justify-between mb-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-2',
                              children: [
                                (0, t.jsx)(i.A, {
                                  className: 'h-5 w-5 text-purple-400',
                                }),
                                (0, t.jsx)('h3', {
                                  className: 'jsx-cf4ad6ff363bf3 font-semibold',
                                  children: 'Gas Price',
                                }),
                              ],
                            }),
                            (0, t.jsx)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-2xl font-bold text-purple-400',
                              children: S.gasPrice,
                            }),
                          ],
                        }),
                        (0, t.jsx)('div', {
                          className: 'jsx-cf4ad6ff363bf3 text-sm text-gray-400',
                          children: 'gwei',
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center justify-between mb-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-2',
                              children: [
                                (0, t.jsx)(o.A, {
                                  className: 'h-5 w-5 text-green-400',
                                }),
                                (0, t.jsx)('h3', {
                                  className: 'jsx-cf4ad6ff363bf3 font-semibold',
                                  children: 'Block Time',
                                }),
                              ],
                            }),
                            (0, t.jsx)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-2xl font-bold text-green-400',
                              children: S.blockTime,
                            }),
                          ],
                        }),
                        (0, t.jsx)('div', {
                          className: 'jsx-cf4ad6ff363bf3 text-sm text-gray-400',
                          children: 'seconds',
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center justify-between mb-4',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-2',
                              children: [
                                (0, t.jsx)(m.A, {
                                  className: 'h-5 w-5 text-yellow-400',
                                }),
                                (0, t.jsx)('h3', {
                                  className: 'jsx-cf4ad6ff363bf3 font-semibold',
                                  children: 'Uptime',
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-2xl font-bold text-yellow-400',
                              children: [S.uptime.toFixed(2), '%'],
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3 text-sm text-gray-400',
                          children: [S.validators, ' validators'],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)('div', {
                  className:
                    'jsx-cf4ad6ff363bf3 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8',
                  children: [
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center justify-between mb-6',
                          children: [
                            (0, t.jsx)('h3', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-xl font-semibold',
                              children: 'Network Trends',
                            }),
                            (0, t.jsx)('div', {
                              className: 'jsx-cf4ad6ff363bf3 flex space-x-2',
                              children: ['tps', 'gas', 'blocks'].map((e) =>
                                (0, t.jsx)(
                                  'button',
                                  {
                                    onClick: () => w(e),
                                    className:
                                      'jsx-cf4ad6ff363bf3 ' +
                                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors '.concat(
                                        y === e
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                      ),
                                    children: e.toUpperCase(),
                                  },
                                  e
                                )
                              ),
                            }),
                          ],
                        }),
                        (0, t.jsx)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 h-32 bg-gray-900 rounded-lg p-4 flex items-end space-x-2',
                          children: Array.from({ length: 12 }, (e, s) =>
                            (0, t.jsx)(
                              'div',
                              {
                                style: {
                                  height: ''.concat(
                                    80 * Math.random() + 20,
                                    '%'
                                  ),
                                  animationDelay: ''.concat(100 * s, 'ms'),
                                  animation: 'fadeInUp 0.5s ease-out forwards',
                                },
                                title: ''
                                  .concat(y.toUpperCase(), ' point ')
                                  .concat(s + 1, ': ')
                                  .concat(Math.floor(100 * Math.random())),
                                className:
                                  'jsx-cf4ad6ff363bf3 flex-1 bg-blue-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer',
                              },
                              s
                            )
                          ),
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 bg-gray-800/50 rounded-xl p-6 border border-gray-700',
                      children: [
                        (0, t.jsx)('h3', {
                          className:
                            'jsx-cf4ad6ff363bf3 text-xl font-semibold mb-6',
                          children: 'Network Tools',
                        }),
                        (0, t.jsxs)('div', {
                          className: 'jsx-cf4ad6ff363bf3 space-y-4',
                          children: [
                            (0, t.jsx)('button', {
                              onClick: () =>
                                alert(
                                  'Network stress test initiated! This would monitor network performance under load.'
                                ),
                              className:
                                'jsx-cf4ad6ff363bf3 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                              children: '\uD83D\uDE80 Run Network Stress Test',
                            }),
                            (0, t.jsx)('button', {
                              onClick: () =>
                                alert(
                                  'Network Analysis Complete:\n\n• Current TPS: '
                                    .concat(S.tps, '\n• Gas Efficiency: ')
                                    .concat(
                                      Math.floor(20 * Math.random() + 80),
                                      '%\n• Network Health: Excellent\n• Congestion Level: Low\n• Optimal Transaction Time: Now'
                                    )
                                ),
                              className:
                                'jsx-cf4ad6ff363bf3 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                              children: '\uD83D\uDCCA Generate Network Report',
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 grid grid-cols-2 gap-3',
                              children: [
                                (0, t.jsx)('button', {
                                  onClick: () =>
                                    alert(
                                      'Monitoring started! Real-time alerts enabled for unusual network activity.'
                                    ),
                                  className:
                                    'jsx-cf4ad6ff363bf3 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                  children: '\uD83D\uDD0D Monitor Mode',
                                }),
                                (0, t.jsx)('button', {
                                  onClick: () => {
                                    (T({
                                      tps: Math.floor(50 * Math.random()) + 20,
                                      gasPrice:
                                        Math.floor(20 * Math.random()) + 5,
                                      blockTime:
                                        Math.floor(5 * Math.random()) + 2,
                                      validators:
                                        S.validators +
                                        Math.floor(3 * Math.random()) -
                                        1,
                                      uptime: 99.9 + 0.09 * Math.random(),
                                    }),
                                      alert('Network metrics refreshed!'));
                                  },
                                  className:
                                    'jsx-cf4ad6ff363bf3 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                  children: '\uD83D\uDD04 Force Refresh',
                                }),
                              ],
                            }),
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 bg-gray-900/50 rounded-lg p-4 mt-4',
                              children: [
                                (0, t.jsx)('div', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 text-xs text-gray-400 mb-2',
                                  children: 'Quick Stats',
                                }),
                                (0, t.jsxs)('div', {
                                  className:
                                    'jsx-cf4ad6ff363bf3 grid grid-cols-2 gap-2 text-sm',
                                  children: [
                                    (0, t.jsxs)('div', {
                                      className: 'jsx-cf4ad6ff363bf3',
                                      children: [
                                        'Peak TPS: ',
                                        (0, t.jsx)('span', {
                                          className:
                                            'jsx-cf4ad6ff363bf3 text-green-400 font-mono',
                                          children: '127',
                                        }),
                                      ],
                                    }),
                                    (0, t.jsxs)('div', {
                                      className: 'jsx-cf4ad6ff363bf3',
                                      children: [
                                        'Min Gas: ',
                                        (0, t.jsx)('span', {
                                          className:
                                            'jsx-cf4ad6ff363bf3 text-blue-400 font-mono',
                                          children: '3.2 gwei',
                                        }),
                                      ],
                                    }),
                                    (0, t.jsxs)('div', {
                                      className: 'jsx-cf4ad6ff363bf3',
                                      children: [
                                        'Avg Block: ',
                                        (0, t.jsx)('span', {
                                          className:
                                            'jsx-cf4ad6ff363bf3 text-purple-400 font-mono',
                                          children: '2.1s',
                                        }),
                                      ],
                                    }),
                                    (0, t.jsxs)('div', {
                                      className: 'jsx-cf4ad6ff363bf3',
                                      children: [
                                        'Health: ',
                                        (0, t.jsx)('span', {
                                          className:
                                            'jsx-cf4ad6ff363bf3 text-green-400 font-mono',
                                          children: '99.8%',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)('div', {
                  className:
                    'jsx-cf4ad6ff363bf3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600 mb-8',
                  children: [
                    (0, t.jsxs)('div', {
                      className: 'jsx-cf4ad6ff363bf3 text-center mb-8',
                      children: [
                        (0, t.jsx)('h2', {
                          className:
                            'jsx-cf4ad6ff363bf3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2',
                          children: 'POWERED BY AGENTSKILLS',
                        }),
                        (0, t.jsx)('p', {
                          className: 'jsx-cf4ad6ff363bf3 text-gray-300',
                          children:
                            'Enterprise-grade AI skills powering real-time network monitoring',
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-blue-400 transition-colors',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-3 mb-4',
                              children: [
                                (0, t.jsx)(b.A, {
                                  className: 'h-8 w-8 text-blue-400',
                                }),
                                (0, t.jsxs)('div', {
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: [
                                    (0, t.jsx)('h4', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 font-semibold text-blue-400',
                                      children: 'Etherscan API',
                                    }),
                                    (0, t.jsx)('p', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 text-xs text-gray-400',
                                      children: 'Blockchain Data Retrieval',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsx)('p', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                              children:
                                "Real-time blockchain data retrieval for gas prices, transaction metrics, and network statistics directly from Etherscan's comprehensive API.",
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-purple-400 transition-colors',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-3 mb-4',
                              children: [
                                (0, t.jsx)(j.A, {
                                  className: 'h-8 w-8 text-purple-400',
                                }),
                                (0, t.jsxs)('div', {
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: [
                                    (0, t.jsx)('h4', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 font-semibold text-purple-400',
                                      children: 'Base RPC',
                                    }),
                                    (0, t.jsx)('p', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 text-xs text-gray-400',
                                      children: 'Network Connectivity',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsx)('p', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                              children:
                                'Direct interaction with Base L2 network through optimized RPC calls for block times, validator data, and network health monitoring.',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-green-400 transition-colors',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-3 mb-4',
                              children: [
                                (0, t.jsx)(x.A, {
                                  className: 'h-8 w-8 text-green-400',
                                }),
                                (0, t.jsxs)('div', {
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: [
                                    (0, t.jsx)('h4', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 font-semibold text-green-400',
                                      children: 'Live Monitoring',
                                    }),
                                    (0, t.jsx)('p', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 text-xs text-gray-400',
                                      children: 'Real-time Analytics',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsx)('p', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                              children:
                                'Continuous network health monitoring with intelligent alerting, trend analysis, and predictive insights for optimal transaction timing.',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-yellow-400 transition-colors',
                          children: [
                            (0, t.jsxs)('div', {
                              className:
                                'jsx-cf4ad6ff363bf3 flex items-center space-x-3 mb-4',
                              children: [
                                (0, t.jsx)(h.A, {
                                  className: 'h-8 w-8 text-yellow-400',
                                }),
                                (0, t.jsxs)('div', {
                                  className: 'jsx-cf4ad6ff363bf3',
                                  children: [
                                    (0, t.jsx)('h4', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 font-semibold text-yellow-400',
                                      children: 'Auto-Deploy',
                                    }),
                                    (0, t.jsx)('p', {
                                      className:
                                        'jsx-cf4ad6ff363bf3 text-xs text-gray-400',
                                      children: 'Build Pipeline',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsx)('p', {
                              className:
                                'jsx-cf4ad6ff363bf3 text-sm text-gray-300',
                              children:
                                'Automated build and deployment pipeline ensuring zero-downtime updates, version control, and seamless feature rollouts.',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)('footer', {
                  className:
                    'jsx-cf4ad6ff363bf3 text-center py-8 border-t border-gray-700 mt-8',
                  children: [
                    (0, t.jsxs)('p', {
                      className: 'jsx-cf4ad6ff363bf3 text-gray-400 text-sm',
                      children: [
                        'Built with ',
                        (0, t.jsx)('span', {
                          className: 'jsx-cf4ad6ff363bf3 text-red-400',
                          children: '♥',
                        }),
                        ' on Base L2 •',
                        (0, t.jsx)('span', {
                          className: 'jsx-cf4ad6ff363bf3 text-blue-400 ml-2',
                          children: 'Powered by AgentSkills',
                        }),
                      ],
                    }),
                    (0, t.jsxs)('div', {
                      className:
                        'jsx-cf4ad6ff363bf3 flex justify-center items-center space-x-4 mt-4',
                      children: [
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 text-xs text-gray-500',
                          children: [
                            (0, t.jsx)(g.A, {
                              className: 'h-3 w-3 text-green-400',
                            }),
                            (0, t.jsx)('span', {
                              className: 'jsx-cf4ad6ff363bf3',
                              children: 'Bloomberg Design System',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 text-xs text-gray-500',
                          children: [
                            (0, t.jsx)(g.A, {
                              className: 'h-3 w-3 text-green-400',
                            }),
                            (0, t.jsx)('span', {
                              className: 'jsx-cf4ad6ff363bf3',
                              children: 'Real-time Data Integration',
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          className:
                            'jsx-cf4ad6ff363bf3 flex items-center space-x-2 text-xs text-gray-500',
                          children: [
                            (0, t.jsx)(g.A, {
                              className: 'h-3 w-3 text-green-400',
                            }),
                            (0, t.jsx)('span', {
                              className: 'jsx-cf4ad6ff363bf3',
                              children: 'Interactive Controls',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsx)(f(), {
              id: 'cf4ad6ff363bf3',
              children:
                '@keyframes fadeInUp{from{opacity:0;transform:translatey(10px)}to{opacity:.7;transform:translatey(0)}}.slider.jsx-cf4ad6ff363bf3::-webkit-slider-thumb{appearance:none;height:16px;width:16px;border-radius:50%;background:#3b82f6;cursor:pointer}.slider.jsx-cf4ad6ff363bf3::-moz-range-thumb{height:16px;width:16px;border-radius:50%;background:#3b82f6;cursor:pointer;border:none}',
            }),
          ],
        });
      }
    },
  },
  (e) => {
    (e.O(0, [598, 441, 255, 358], () => e((e.s = 4389))), (_N_E = e.O()));
  },
]);
