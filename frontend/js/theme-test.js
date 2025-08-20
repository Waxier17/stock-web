// Script de teste para verificar funcionamento do sistema de tema unificado
(function() {
    console.log('🧪 Iniciando testes do sistema de tema...');
    
    function runThemeTests() {
        const tests = [];
        
        // Teste 1: Verificar se o sistema unificado foi carregado
        tests.push({
            name: 'Sistema Unificado Carregado',
            test: () => typeof window.unifiedThemeSystem === 'function',
            expected: true
        });
        
        // Teste 2: Verificar se a instância está funcionando
        tests.push({
            name: 'Instância do Tema Funcionando',
            test: () => {
                try {
                    const system = window.unifiedThemeSystem();
                    return system && typeof system.getTheme === 'function';
                } catch (e) {
                    return false;
                }
            },
            expected: true
        });
        
        // Teste 3: Verificar se data-theme está definido
        tests.push({
            name: 'Atributo data-theme Definido',
            test: () => {
                const theme = document.documentElement.getAttribute('data-theme');
                return theme === 'light' || theme === 'dark';
            },
            expected: true
        });
        
        // Teste 4: Verificar se variáveis CSS estão definidas
        tests.push({
            name: 'Variáveis CSS Aplicadas',
            test: () => {
                const computed = getComputedStyle(document.documentElement);
                const bgPrimary = computed.getPropertyValue('--background-primary');
                return bgPrimary && bgPrimary.trim() !== '';
            },
            expected: true
        });
        
        // Teste 5: Verificar se theme-ready class foi aplicada
        tests.push({
            name: 'Classe theme-ready Aplicada',
            test: () => document.documentElement.classList.contains('theme-ready'),
            expected: true
        });
        
        // Teste 6: Verificar se scripts antigos não estão sendo carregados
        tests.push({
            name: 'Scripts Antigos Removidos',
            test: () => {
                const scripts = Array.from(document.scripts);
                return !scripts.some(script => 
                    script.src.includes('theme-system.js') ||
                    script.src.includes('dark-theme-aggressive-fixes.js') ||
                    script.src.includes('emergency-white-box-fix.js')
                );
            },
            expected: true
        });
        
        // Executar testes
        let passed = 0;
        let failed = 0;
        
        console.log('📋 Executando testes...');
        
        tests.forEach(test => {
            try {
                const result = test.test();
                if (result === test.expected) {
                    console.log(`✅ ${test.name}: PASSOU`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FALHOU (esperado: ${test.expected}, obtido: ${result})`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERRO - ${error.message}`);
                failed++;
            }
        });
        
        console.log(`\n📊 Resultados: ${passed} passou, ${failed} falhou`);
        
        if (failed === 0) {
            console.log('🎉 Todos os testes passaram! Sistema de tema funcionando corretamente.');
        } else {
            console.log('⚠️ Alguns testes falharam. Verifique os problemas acima.');
        }
        
        return { passed, failed, total: tests.length };
    }
    
    // Função para testar toggle de tema
    function testThemeToggle() {
        console.log('🔄 Testando toggle de tema...');
        
        try {
            const system = window.unifiedThemeSystem();
            const initialTheme = system.getActualTheme();
            
            console.log(`Tema inicial: ${initialTheme}`);
            
            // Fazer toggle
            system.toggleTheme();
            
            setTimeout(() => {
                const newTheme = system.getActualTheme();
                console.log(`Novo tema: ${newTheme}`);
                
                if (newTheme !== initialTheme) {
                    console.log('✅ Toggle de tema funcionando');
                } else {
                    console.log('❌ Toggle de tema não funcionou');
                }
                
                // Voltar ao tema original
                setTimeout(() => {
                    system.toggleTheme();
                    console.log(`Tema restaurado: ${system.getActualTheme()}`);
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.log(`❌ Erro no teste de toggle: ${error.message}`);
        }
    }
    
    // Função para verificar elementos problemáticos
    function checkProblematicElements() {
        console.log('🔍 Verificando elementos problemáticos...');
        
        const selectors = [
            '.modern-card',
            '.card',
            '.stat-card-enhanced',
            '.modal-content',
            '.form-input',
            '.btn',
            '.alert'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} ${selector} elements`);
                
                elements.forEach((element, index) => {
                    const computed = getComputedStyle(element);
                    const bgColor = computed.backgroundColor;
                    const textColor = computed.color;
                    
                    // Verificar se tem cores problemáticas
                    if (bgColor === 'rgb(255, 255, 255)' && document.documentElement.getAttribute('data-theme') === 'dark') {
                        console.log(`⚠️ Elemento ${selector}[${index}] tem fundo branco no tema escuro`);
                    }
                    
                    if (textColor === 'rgb(0, 0, 0)' && document.documentElement.getAttribute('data-theme') === 'dark') {
                        console.log(`⚠️ Elemento ${selector}[${index}] tem texto preto no tema escuro`);
                    }
                });
            }
        });
    }
    
    // Exportar funções para uso global
    window.themeTests = {
        run: runThemeTests,
        testToggle: testThemeToggle,
        checkElements: checkProblematicElements
    };
    
    // Executar testes automaticamente após 2 segundos
    setTimeout(() => {
        runThemeTests();
        
        // Se estivermos no modo debug, executar testes adicionais
        if (window.location.search.includes('debug=theme')) {
            setTimeout(() => {
                testThemeToggle();
                checkProblematicElements();
            }, 2000);
        }
    }, 2000);
    
    console.log('🧪 Sistema de testes carregado. Use themeTests.run(), themeTests.testToggle(), ou themeTests.checkElements()');
})();
