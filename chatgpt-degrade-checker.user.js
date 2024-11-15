// ==UserScript==
// @name            ChatGPT Degrade Checker
// @name:fr-FR      Détecteur de Dégradation ChatGPT
// @name:zh-CN      ChatGPT 降级检测器
// @name:zh-TW      ChatGPT 降級檢測器
// @name:es-ES      ChatGPT Degrade Checker
// @namespace       https://github.com/travertexs/chatgpt-degrade-checker
// @homepage        https://github.com/travertexs/chatgpt-degrade-checker
// @version         3.20
// @description:en  Detects the risk level of your IP in ChatGPT's database due to potential service degradation.
// @description:zh  由于 ChatGPT 会对某些 ip 进行无提示的服务降级，此脚本用于检测你的 ip 在 ChatGPT 数据库中的风险等级。
// @author          KoriIku, travertexs, o1-mini
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0iIzJjM2U1MCIgZD0iTTMyIDJDMTUuNDMyIDIgMiAxNS40MzIgMiAzMnMxMy40MzIgMzAgMzAgMzAgMzAtMTMuNDMyIDMwLTMwUzQ4LjU2OCAyIDMyIDJ6bTAgNTRjLTEzLjIzMyAwLTI0LTEwLjc2Ny0yNC0yNFMxOC43NjcgOCAzMiA4czI0IDEwLjc2NyAyNCAyNFM0NS4yMzMgNTYgMzIgNTZ6Ii8+PHBhdGggZmlsbD0iIzNkYzJmZiIgZD0iTTMyIDEyYy0xMS4wNDYgMC0yMCA4Ljk1NC0yMCAyMHM4Ljk1NCAyMCAyMCAyMCAyMC04Ljk1NCAyMC0yMFM0My4wNDYgMTIgMzIgMTJ6bTAgMzZjLTguODM3IDAtMTYtNy4xNjMtMTYtMTZzNy4xNjMtMTYgMTYtMTYgMTYgNy4xNjMgMTYgMTZTNDAuODM3IDQ4IDMyIDQ4eiIvPjxwYXRoIGZpbGw9IiMwMGZmN2YiIGQ9Ik0zMiAyMGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMlMzOC42MjcgMjAgMzIgMjB6bTAgMjBjLTQuNDE4IDAtOC0zLjU4Mi04LThzMy41ODItOCA4LTggOCAzLjU4MiA4IDgtMy41ODIgOC04IDh6Ii8+PGNpcmNsZSBmaWxsPSIjZmZmIiBjeD0iMzIiIGN5PSIzMiIgcj0iNCIvPjwvc3ZnPg==
// @match           *://chatgpt.com/*
// @grant           none
// @downloadURL     https://github.com/travertexs/chatgpt-degrade-checker/raw/refs/heads/main/chatgpt-degrade-checker.user.js
// @updateURL       https://github.com/travertexs/chatgpt-degrade-checker/raw/refs/heads/main/chatgpt-degrade-checker.user.js
// @license         AGPLv3
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------
    // 1. Constants and Configurations
    // ----------------------------
    const TRANSITION_DURATION = 300; // in milliseconds
    const DEFAULT_LANGUAGE = 'default';
    const FALLBACK_LANGUAGE = 'en';
    const STORAGE_KEY_LANGUAGE = 'chatgpt_degrade_checker_language';
    const STORAGE_KEY_THEME = 'chatgpt_degrade_checker_theme';
    const HIDE_DELAY = 500; // in milliseconds
    const DEFAULT_THEME = 'dark';

    // Variable to store the last PoW request resource and options for manual refresh
    let lastResource = null;
    let lastOptions = null;

    // ----------------------------
    // 2. Theme Definitions
    // ----------------------------
    const themes = {
        'dark': {
            name: 'Dark',
            backgroundColor: 'rgba(50, 50, 50, 0.5)', // Preserved blur effect with opacity
            textColor: '#FFFFFF',
            tooltipBackground: 'rgba(50, 50, 50, 0.5)', // Lowered opacity for better blur visibility
            tooltipTextColor: '#FFFFFF',
            selectBackground: 'rgba(0, 0, 0, 0.5)',
            selectTextColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            // iconPrimaryColor and iconSecondaryColor are retained only for dark theme
            iconPrimaryColor: '#3498db',
            iconSecondaryColor: '#2ecc71',
            titleColor: '#FFFFFF' // For title
        },
        'light': {
            name: 'Light',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Preserved blur effect with opacity
            textColor: '#000000',
            tooltipBackground: 'rgba(240, 240, 240, 0.5)', // Lowered opacity for better blur visibility
            tooltipTextColor: '#000000',
            selectBackground: 'rgba(255, 255, 255, 0.8)',
            selectTextColor: '#000000',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            // Removed iconPrimaryColor and iconSecondaryColor for non-dark themes
            titleColor: '#000000' // For title
        }
        // ... you can add more themes here without icon colors
    };

    // ----------------------------
    // 3. Localization Dictionary
    // ----------------------------
    const localizations = {
        'en': {
            'language_name': 'English',
            'default_option': 'Browser Default',
            'pow_info': 'PoW Information',
            'pow_difficulty': 'PoW Difficulty',
            'ip_quality': 'IP Quality',
            'user_persona': 'User Persona',
            'chatgpt_degrade_checker': 'ChatGPT Degrade Checker',
            'tooltip_text': 'A smaller value indicates higher PoW difficulty, meaning ChatGPT considers your IP to have a higher risk.',
            'language_label': 'Language:',
            'theme_label': 'Theme:',
            'light_theme': 'Light',
            'dark_theme': 'Dark',
            'high_risk': 'High Risk',
            'medium_risk': 'Medium Risk',
            'low_risk': 'Good',
            'verylow_risk': 'Excellent',
            'difficult': '(Difficult)',
            'medium': '(Medium)',
            'easy': '(Easy)',
            'very_easy': '(Very Easy)',
            'n_a': 'N/A',
            'error_parsing_response': 'Error parsing response',
            'refresh_button': 'Refresh',
            'refreshing': 'Refreshing...'
        },
        'fr': {
            'language_name': 'Français',
            'default_option': 'Par Défaut',
            'pow_info': 'Informations sur PoW',
            'pow_difficulty': 'Difficulté PoW',
            'ip_quality': 'Qualité de l\'IP',
            'user_persona': 'Profil Utilisateur',
            'chatgpt_degrade_checker': 'Détecteur de Dégradation ChatGPT',
            'tooltip_text': 'Une valeur plus petite indique une difficulté PoW plus élevée, ce qui signifie que ChatGPT considère que votre IP présente un risque plus élevé.',
            'language_label': 'Langue:',
            'theme_label': 'Thème:',
            'light_theme': 'Clair',
            'dark_theme': 'Sombre',
            'high_risk': 'Risque Élevé',
            'medium_risk': 'Risque Moyen',
            'low_risk': 'Bon',
            'verylow_risk': 'Excellent',
            'difficult': '(Difficile)',
            'medium': '(Moyen)',
            'easy': '(Facile)',
            'very_easy': '(Très Facile)',
            'n_a': 'N/A',
            'error_parsing_response': 'Erreur lors de l\'analyse de la réponse',
            'refresh_button': 'Rafraîchir',
            'refreshing': 'Rafraîchissement...'
        },
        'zh': {
            'language_name': '简体中文',
            'default_option': '浏览器默认',
            'pow_info': 'PoW 信息',
            'pow_difficulty': 'PoW 难度',
            'ip_quality': 'IP 质量',
            'user_persona': '用户类型',
            'chatgpt_degrade_checker': 'ChatGPT 降级检测器',
            'tooltip_text': '这个值越小，代表 PoW 难度越高，ChatGPT 认为你的 IP 风险越高。',
            'language_label': '语言:',
            'theme_label': '主题:',
            'light_theme': '浅色',
            'dark_theme': '深色',
            'high_risk': '高风险',
            'medium_risk': '中等风险',
            'low_risk': '良好',
            'verylow_risk': '优秀',
            'difficult': '(困难)',
            'medium': '(中等)',
            'easy': '(简单)',
            'very_easy': '(极易)',
            'n_a': 'N/A',
            'error_parsing_response': '解析响应时出错',
            'refresh_button': '刷新',
            'refreshing': '正在刷新...'
        },
        'zh-TW': {
            'language_name': '繁體中文',
            'default_option': '瀏覽器預設',
            'pow_info': 'PoW 資訊',
            'pow_difficulty': 'PoW 難度',
            'ip_quality': 'IP 品質',
            'user_persona': '用戶類型',
            'chatgpt_degrade_checker': 'ChatGPT 降級檢測器',
            'tooltip_text': '這個值越小，代表 PoW 難度越高，ChatGPT 認為你的 IP 風險越高。',
            'language_label': '語言:',
            'theme_label': '主題:',
            'light_theme': '淺色',
            'dark_theme': '深色',
            'high_risk': '高風險',
            'medium_risk': '中等風險',
            'low_risk': '良好',
            'verylow_risk': '優秀',
            'difficult': '(困難)',
            'medium': '(中等)',
            'easy': '(簡單)',
            'very_easy': '(極易)',
            'n_a': 'N/A',
            'error_parsing_response': '解析回應時出錯',
            'refresh_button': '刷新',
            'refreshing': '正在刷新...'
        },
        'es': {
            'language_name': 'Español',
            'default_option': 'Predeterminado',
            'pow_info': 'Información de PoW',
            'pow_difficulty': 'Dificultad de PoW',
            'ip_quality': 'Calidad de la IP',
            'user_persona': 'Perfil de Usuario',
            'chatgpt_degrade_checker': 'Verificador de Degradación de ChatGPT',
            'tooltip_text': 'Un valor más pequeño indica una mayor dificultad de PoW, lo que significa que ChatGPT considera que tu IP tiene un mayor riesgo.',
            'language_label': 'Idioma:',
            'theme_label': 'Tema:',
            'light_theme': 'Claro',
            'dark_theme': 'Oscuro',
            'high_risk': 'Alto Riesgo',
            'medium_risk': 'Riesgo Medio',
            'low_risk': 'Bueno',
            'verylow_risk': 'Excelente',
            'difficult': '(Difícil)',
            'medium': '(Medio)',
            'easy': '(Fácil)',
            'very_easy': '(Muy Fácil)',
            'n_a': 'N/D',
            'error_parsing_response': 'Error al analizar la respuesta',
            'refresh_button': 'Actualizar',
            'refreshing': 'Actualizando...'
        },
        // More localizations can be added as needed
    };    

    // ----------------------------
    // 4. Localization Management
    // ----------------------------

    // Function to get user's preferred language
    function getUserLanguage() {
        const savedLanguage = localStorage.getItem(STORAGE_KEY_LANGUAGE);
        
        if (savedLanguage && savedLanguage !== DEFAULT_LANGUAGE && localizations[savedLanguage]) {
            return savedLanguage;
        }

        return DEFAULT_LANGUAGE;
    }

    // Function to determine effective language based on current selection
    function getEffectiveLanguage(lang) {
        let userLanguage = lang;
        if (!localizations[userLanguage])
        {
            userLanguage = getUserLanguage();
        }

        if(userLanguage === DEFAULT_LANGUAGE)
        {
            // Fallback to browser language
            const browserLang = navigator.language;
            if (localizations[browserLang])
            {
                return browserLang;
            }

            // Attempt to match base language if full code isn't available
            const baseLang = browserLang.split('-')[0];
            return localizations[baseLang] ? baseLang : FALLBACK_LANGUAGE;
        }

        return userLanguage;
    }

    // Function to set user's preferred language
    function setUserLanguage(lang) {
        if (lang === DEFAULT_LANGUAGE) {
            localStorage.setItem(STORAGE_KEY_LANGUAGE, DEFAULT_LANGUAGE);

            currentLanguage = DEFAULT_LANGUAGE;
            activeLanguage = getEffectiveLanguage(currentLanguage);
        } else if (localizations[lang]) {
            localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);

            currentLanguage = lang;
            activeLanguage = lang;
        }
        updateUIText();
        // Reapply dynamic localizations
        reapplyDynamicLocalizations();
    }

    let currentLanguage = getUserLanguage();
    let activeLanguage = getEffectiveLanguage(currentLanguage);

    // Function to get user's preferred theme
    function getUserTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        if (savedTheme && themes[savedTheme]) {
            return savedTheme;
        }
        return DEFAULT_THEME;
    }

    // Function to set user's preferred theme
    function setUserTheme(theme) {
        if (themes[theme]) {
            localStorage.setItem(STORAGE_KEY_THEME, theme);
            currentTheme = theme;
            applyTheme();
        }
    }

    let currentTheme = getUserTheme();

    // ----------------------------
    // 5. Helper Function to Get Localized Text
    // ----------------------------
    function t(key) {
        return localizations[activeLanguage][key] || localizations[FALLBACK_LANGUAGE][key] || key;
    }

    // ----------------------------
    // 6. User Interface Components
    // ----------------------------

    // Create display box
    const displayBox = document.createElement('div');
    displayBox.classList.add('display-box'); // Assign a class for easier styling
    Object.assign(displayBox.style, {
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        minWidth: '200px',
        maxWidth: '400px',
        width: 'auto',
        minHeight: '150px',
        maxHeight: '500px',
        height: 'auto',
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: themes[currentTheme].backgroundColor,
        backdropFilter: 'blur(10px)',             // Preserved blur effect
        WebkitBackdropFilter: 'blur(10px)',       // Preserved blur effect for Safari
        color: themes[currentTheme].textColor,
        fontSize: '14px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        transition: `opacity ${TRANSITION_DURATION}ms ease, visibility ${TRANSITION_DURATION}ms ease, background-color ${TRANSITION_DURATION}ms ease, color ${TRANSITION_DURATION}ms ease`,
        opacity: '0',
        visibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        wordWrap: 'break-word',
        wordBreak: 'break-word'
    });

    displayBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong id="pow-info-title">${t('pow_info')}</strong>
            <button id="refresh-button" style="
                background: none;
                border: none;
                color: ${themes[currentTheme].textColor};
                cursor: pointer;
                font-size: 14px;
                padding: 0;
                margin: 0;
                outline: none;
            ">${t('refresh_button')}</button>
        </div>
        <div id="content" style="flex: 1 1 auto;">
            <div>
                <span id="pow-difficulty-label">${t('pow_difficulty')}: </span>
                <span id="difficulty">${t('n_a')}</span>
                <span id="difficulty-level" style="margin-left: 3px"></span>
                <span id="difficulty-tooltip" role="button" aria-label="Tooltip for difficulty explanation" style="
                    cursor: pointer;
                    color: ${themes[currentTheme].textColor};
                    font-size: 12px;
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    line-height: 14px;
                    text-align: center;
                    border-radius: 50%;
                    border: 1px solid ${themes[currentTheme].textColor};
                    margin-left: 3px;
                ">?</span>
            </div>
            <div>
                <span id="ip-quality-label">${t('ip_quality')}: </span>
                <span id="ip-quality">${t('n_a')}</span>
            </div>
            <div id="persona-container" style="display: none;">
                <span id="user-persona-label">${t('user_persona')}: </span>
                <span id="persona">${t('n_a')}</span>
            </div>
            <div style="margin-top: 10px;">
                <span id="language-label">${t('language_label')} </span>
                <select id="language-select" style="
                    margin-top: 5px;
                    width: 100%;
                    padding: 5px;
                    border-radius: 5px;
                    color: ${themes[currentTheme].selectTextColor};
                    background-color: ${themes[currentTheme].selectBackground};
                    border: 1px solid ${themes[currentTheme].textColor};
                ">
                    <option value="default" ${currentLanguage === DEFAULT_LANGUAGE ? 'selected' : ''}>${t('default_option')}</option>
                    ${Object.keys(localizations).map(lang => `<option value="${lang}" ${lang === activeLanguage && currentLanguage !== DEFAULT_LANGUAGE ? 'selected' : ''}>${localizations[lang].language_name}</option>`).join('')}
                </select>
            </div>
            <div style="margin-top: 10px;">
                <span id="theme-label">${t('theme_label')} </span>
                <select id="theme-select" style="
                    margin-top: 5px;
                    width: 100%;
                    padding: 5px;
                    border-radius: 5px;
                    color: ${themes[currentTheme].selectTextColor};
                    background-color: ${themes[currentTheme].selectBackground};
                    border: 1px solid ${themes[currentTheme].textColor};
                ">
                    ${Object.keys(themes).map(themeKey => `<option value="${themeKey}" ${themeKey === currentTheme ? 'selected' : ''}>${t(`${themeKey}_theme`)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div style="
            margin-top: 12px;
            padding-top: 8px;
            border-top: 0.5px solid ${themes[currentTheme].borderColor};
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            letter-spacing: 0.3px;
        ">
            <span id="checker-name">${t('chatgpt_degrade_checker')}</span>
        </div>`;
    document.body.appendChild(displayBox);

    // Create collapsed indicator
    const collapsedIndicator = document.createElement('div');
    collapsedIndicator.classList.add('collapsed-indicator');
    Object.assign(collapsedIndicator.style, {
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        width: '32px',
        height: '32px',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '10000',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `opacity ${TRANSITION_DURATION}ms ease, background-color ${TRANSITION_DURATION}ms ease`,
        opacity: '1'
    });

    // SVG Icon for the indicator with fixed gradient colors (dark theme's style)
    collapsedIndicator.innerHTML = `
    <svg id="status-icon" width="32" height="32" viewBox="0 0 64 64" style="transition: all ${TRANSITION_DURATION}ms ease;">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g id="icon-group" filter="url(#glow)">
            <circle cx="32" cy="32" r="28" fill="url(#gradient)" stroke="#FFFFFF" stroke-width="2"/> <!-- Fixed stroke color -->
            <circle cx="32" cy="32" r="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="100">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 32 32"
                    to="360 32 32"
                    dur="8s"
                    repeatCount="indefinite"/>
            </circle>
            <circle cx="32" cy="32" r="12" fill="none" stroke="#FFFFFF" stroke-width="2">
                <animate
                    attributeName="r"
                    values="12;14;12"
                    dur="2s"
                    repeatCount="indefinite"/>
            </circle>
            <circle id="center-dot" cx="32" cy="32" r="4" fill="#FFFFFF"> <!-- Fixed fill color -->
                <animate
                    attributeName="r"
                    values="4;6;4"
                    dur="2s"
                    repeatCount="indefinite"/>
            </circle>
        </g>
    </svg>`;
    document.body.appendChild(collapsedIndicator);

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.innerText = t('tooltip_text');
    Object.assign(tooltip.style, {
        position: 'fixed',
        backgroundColor: themes[currentTheme].tooltipBackground, // Match the displayBox background color
        color: themes[currentTheme].tooltipTextColor,
        padding: '8px 12px',
        borderRadius: '5px',
        fontSize: '12px',
        visibility: 'hidden',
        zIndex: '10001',
        minWidth: '150px',      // Set minimum width
        maxWidth: '300px',      // Set maximum width
        width: 'auto',          // Allow dynamic width within min and max
        minHeight: '50px',      // Set minimum height
        height: 'auto',         // Allow dynamic height
        lineHeight: '1.4',
        pointerEvents: 'none',
        transition: `opacity ${TRANSITION_DURATION}ms ease, background-color ${TRANSITION_DURATION}ms ease, color ${TRANSITION_DURATION}ms ease`,
        opacity: '0',
        backdropFilter: 'blur(10px)',             // Preserved blur effect
        WebkitBackdropFilter: 'blur(10px)',        // Preserved blur effect for Safari
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.3)` // **Fixed dark shadow**
    });
    document.body.appendChild(tooltip);

    // ----------------------------
    // 7. Event Listeners and Interactivity
    // ----------------------------

    let hideTimer = null;
    const languageSelect = displayBox.querySelector('#language-select');
    const themeSelect = displayBox.querySelector('#theme-select');
    const refreshButton = displayBox.querySelector('#refresh-button');
    let currentDifficulty = 'N/A';
    let currentPersona = 'N/A';

    // Function to show the display box
    function showDisplayBox() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        displayBox.style.visibility = 'visible';
        displayBox.style.opacity = '1';
        collapsedIndicator.style.opacity = '0';
    }

    // Function to hide the display box
    function hideDisplayBox() {
        displayBox.style.opacity = '0';
        collapsedIndicator.style.opacity = '1';
        // After the transition duration, set visibility to hidden
        setTimeout(() => {
            displayBox.style.visibility = 'hidden';
        }, TRANSITION_DURATION);
    }

    // Show display box on hover
    collapsedIndicator.addEventListener('mouseenter', showDisplayBox);

    // Hide display box with delay when mouse leaves
    displayBox.addEventListener('mouseleave', () => {
        hideTimer = setTimeout(hideDisplayBox, HIDE_DELAY);
    });

    // Cancel hide timer if mouse enters the display box again
    displayBox.addEventListener('mouseenter', () => {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    });

    // Show tooltip on hover over the "?"
    const difficultyTooltip = displayBox.querySelector('#difficulty-tooltip');
    difficultyTooltip.addEventListener('mouseenter', function(event) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';

        // Reset position to calculate new dimensions
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';

        // Allow the browser to render the updated size
        requestAnimationFrame(() => {
            const tooltipRect = tooltip.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width;
            const tooltipHeight = tooltipRect.height;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            let leftPosition = mouseX - tooltipWidth - 10;
            if (leftPosition < 10) { // If tooltip goes beyond the left edge
                leftPosition = mouseX + 20;
            }

            let topPosition = mouseY - tooltipHeight - 10;
            if (topPosition < 10) { // If tooltip goes beyond the top edge
                topPosition = mouseY + 20;
            }

            tooltip.style.left = `${leftPosition}px`;
            tooltip.style.top = `${topPosition}px`;
        });
    });

    // Hide tooltip when mouse leaves
    difficultyTooltip.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        // Delay hiding to allow fade-out transition
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
        }, TRANSITION_DURATION);
    });

    // Language selection change handler
    languageSelect.addEventListener('change', function(event) {
        const selectedLang = event.target.value;
        setUserLanguage(selectedLang);
    });

    // Theme selection change handler
    themeSelect.addEventListener('change', function(event) {
        const selectedTheme = event.target.value;
        setUserTheme(selectedTheme);
    });

    // Refresh button click handler
    refreshButton.addEventListener('click', function() {
        if (lastOptions.headers && lastOptions.body) {
            sendSentinelRequest();
        } else {
            console.warn('No PoW request data available to refresh.');
        }
    });

    // ----------------------------
    // 8. Update UI Text Based on Localization
    // ----------------------------
    function updateUIText() {
        // Update static texts
        displayBox.querySelector('#pow-info-title').innerText = t('pow_info');
        displayBox.querySelector('#pow-difficulty-label').innerText = `${t('pow_difficulty')}: `;
        tooltip.innerText = t('tooltip_text');
        displayBox.querySelector('#ip-quality-label').innerText = `${t('ip_quality')}: `;
        displayBox.querySelector('#user-persona-label').innerText = `${t('user_persona')}: `;
        displayBox.querySelector('#checker-name').innerText = t('chatgpt_degrade_checker');
        displayBox.querySelector('#language-label').innerText = `${t('language_label')} `;
        displayBox.querySelector('#theme-label').innerText = `${t('theme_label')} `;

        // Update refresh button text
        displayBox.querySelector('#refresh-button').innerText = t('refresh_button');

        // Update language selector options
        languageSelect.innerHTML = `
            <option value="default" ${currentLanguage === DEFAULT_LANGUAGE ? 'selected' : ''}>${t('default_option')}</option>
            ${Object.keys(localizations).map(lang =>`<option value="${lang}" ${lang === activeLanguage && currentLanguage !== DEFAULT_LANGUAGE ? 'selected' : ''}>${localizations[lang].language_name}</option>`).join('')}
        `;

        // Update theme selector options with localized names
        themeSelect.innerHTML = Object.keys(themes).map(themeKey =>
            `<option value="${themeKey}" ${themeKey === currentTheme ? 'selected' : ''}>${t(`${themeKey}_theme`)}</option>`
        ).join('');
    }

    // Function to reapply dynamic localizations based on current data
    function reapplyDynamicLocalizations() {
        // Reapply difficulty indicator
        updateDifficultyIndicator(currentDifficulty);

        // Reapply persona text if visible
        const personaContainer = displayBox.querySelector('#persona-container');
        if (currentPersona !== 'N/A') {
            personaContainer.style.display = 'block';
            displayBox.querySelector('#persona').innerText = currentPersona;
        } else {
            personaContainer.style.display = 'none';
        }

        // Update tooltip text with new language
        tooltip.innerText = t('tooltip_text');

        // Update refresh button text
        displayBox.querySelector('#refresh-button').innerText = t('refresh_button');
    }

    // ----------------------------
    // 9. Theme Application
    // ----------------------------
    function applyTheme() {
        const theme = themes[currentTheme];

        // Update displayBox styles
        Object.assign(displayBox.style, {
            backgroundColor: theme.backgroundColor,
            color: theme.textColor
        });

        // Update tooltip styles
        Object.assign(tooltip.style, {
            backgroundColor: theme.tooltipBackground,
            color: theme.tooltipTextColor,
            // Fixed dark shadow; does not depend on theme
            boxShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`
        });

        // Update select elements
        languageSelect.style.backgroundColor = theme.selectBackground;
        languageSelect.style.color = theme.selectTextColor;
        languageSelect.style.border = `1px solid ${theme.textColor}`;

        themeSelect.style.backgroundColor = theme.selectBackground;
        themeSelect.style.color = theme.selectTextColor;
        themeSelect.style.border = `1px solid ${theme.textColor}`;

        // Update difficulty tooltip "?" styles
        difficultyTooltip.style.color = theme.textColor;
        difficultyTooltip.style.border = `1px solid ${theme.textColor}`;

        // Update displayBox border-top color
        const borderTop = displayBox.querySelector('div:last-child');
        if (borderTop) {
            borderTop.style.borderTopColor = theme.borderColor;
        }

        // Update the title color explicitly
        const checkerName = displayBox.querySelector('#checker-name');
        if (checkerName) {
            checkerName.style.color = theme.titleColor;
        }

        // Update refresh button styles
        const refreshButton = displayBox.querySelector('#refresh-button');
        if (refreshButton) {
            refreshButton.style.color = theme.textColor;
        }

        // Ensure the icon's stroke colors remain fixed to dark theme's textColor
        const statusIcon = collapsedIndicator.querySelector('#status-icon');
        if (statusIcon) {
            const iconGroup = statusIcon.querySelector('#icon-group');
            if (iconGroup) {
                const circles = iconGroup.querySelectorAll('circle');
                circles.forEach(circle => {
                    if (circle.getAttribute('stroke')) {
                        circle.setAttribute('stroke', themes['dark'].textColor); // Fixed stroke color
                    }
                });
            }
        }

        // Reapply dynamic localizations to update colors and texts
        reapplyDynamicLocalizations();
    }

    // ----------------------------
    // 10. Updating the Difficulty Indicator
    // ----------------------------

    function setIconColors(primaryColor, secondaryColor) {
        const gradient = document.querySelector('#gradient');
        if (gradient) {
            gradient.innerHTML = `
                <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
            `;
        }
    }

    function updateDifficultyIndicator(difficulty) {
        currentDifficulty = difficulty; // Store current difficulty
        const difficultyLevel = displayBox.querySelector('#difficulty-level');
        const ipQuality = displayBox.querySelector('#ip-quality');

        if (difficulty === 'N/A') {
            setIconColors('#888', '#666');
            difficultyLevel.innerText = '';
            ipQuality.innerText = t('n_a');
            return;
        }

        const cleanDifficulty = difficulty.replace('0x', '').replace(/^0+/, '');
        const hexLength = cleanDifficulty.length;

        let color, secondaryColor, textColor, level, qualityText;

        if (hexLength <= 2) {
            color = '#F44336';
            secondaryColor = '#d32f2f';
            textColor = '#ff6b6b';
            level = t('difficult');
            qualityText = t('high_risk');
        } else if (hexLength === 3) {
            color = '#FFC107';
            secondaryColor = '#ffa000';
            textColor = '#ffd700';
            level = t('medium');
            qualityText = t('medium_risk');
        } else if (hexLength === 4) {
            color = '#8BC34A';
            secondaryColor = '#689f38';
            textColor = '#9acd32';
            level = t('easy');
            qualityText = t('low_risk');
        } else {
            color = '#4CAF50';
            secondaryColor = '#388e3c';
            textColor = '#98fb98';
            level = t('very_easy');
            qualityText = t('verylow_risk');
        }

        setIconColors(color, secondaryColor);
        difficultyLevel.innerHTML = `<span style="color: ${textColor}">${level}</span>`;
        ipQuality.innerHTML = `<span style="color: ${textColor}">${qualityText}</span>`;
    }

    // ----------------------------
    // 11. Intercepting Fetch Requests
    // ----------------------------
    // New function to update UI with response data
    async function updateUIWithResponseData(response) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                const difficulty = data.proofofwork?.difficulty || 'N/A';
                const persona = data.persona || 'N/A';

                // Update difficulty display
                const difficultyElement = displayBox.querySelector('#difficulty');
                if (difficultyElement) {
                    difficultyElement.innerText = difficulty !== 'N/A' ? difficulty : t('n_a');
                }

                // Update persona display
                currentPersona = persona !== 'N/A' ? persona : 'N/A';
                const personaContainer = displayBox.querySelector('#persona-container');
                const personaElement = displayBox.querySelector('#persona');

                if (personaContainer && personaElement) {
                    if (persona && !persona.toLowerCase().includes('free')) {
                        personaContainer.style.display = 'block';
                        personaElement.innerText = persona;
                    } else {
                        personaContainer.style.display = 'none';
                    }
                }

                // Update difficulty indicator
                updateDifficultyIndicator(difficulty);
            } else {
                console.error('Response is not JSON:', contentType);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error updating UI with response data:', error);
            throw error; // Re-throw to be caught by the main error handler
        }
    }

    const originalFetch = window.fetch;
    window.fetch = async function(resource, options) {
        const response = await originalFetch(resource, options);

        try {
            if (
                (typeof resource === 'string' && (
                    resource.includes('/backend-api/sentinel/chat-requirements') ||
                    resource.includes('backend-anon/sentinel/chat-requirements')
                )) &&
                options?.method === 'POST'
            ) {
                // Store the last resource and options for manual refresh
                lastResource = resource;
                lastOptions = options;

                // Clone response before consuming it
                const clonedResponse = response.clone();

                // Process the response data and update UI
                await updateUIWithResponseData(clonedResponse);
            }
        } catch (e) {
            console.error(`${t('error_parsing_response')}:`, e.message, e.stack);
        }

        return response;
    };

    // ----------------------------
    // 12. Function to Send Sentinel Request for Manual Refresh
    // ----------------------------
    // Updated sendSentinelRequest function
    async function sendSentinelRequest() {
        if (!lastOptions.headers || !lastOptions.body) {
            console.warn('No PoW request data available to refresh.');
            return;
        }

        // Disable the button and show loading state
        const refreshButton = displayBox.querySelector('#refresh-button');
        refreshButton.disabled = true;
        refreshButton.innerText = t('refreshing');

        try {
            // Determine the correct endpoint
            const resource = lastResource;
            const options = lastOptions;

            const response = await window.fetch(resource, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error refreshing PoW information:', error);
            alert(t('error_parsing_response'));
        } finally {
            // Re-enable the button and reset text
            refreshButton.disabled = false;
            refreshButton.innerText = t('refresh_button');
        }
    }

    // ----------------------------
    // 13. Initial UI Setup
    // ----------------------------
    updateUIText();
    applyTheme();

})();
