import { suite, test } from 'mocha';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Profiler, SourceMap, UnwindTable, ProfileFrame, ProfileFile, Disassemble } from '../../backend/profile';
import { SymbolTable } from '../../backend/symbols';
import { buildModel, IProfileModel } from '../../client/model';
import { profileShrinkler } from '../../backend/shrinkler';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const testOutDir = path.resolve(__dirname, "../../../src/test/suite/data/output/data");
const testHtmlDir = path.resolve(__dirname, "../../../src/test/suite/data/output");
const binDir = path.resolve(__dirname, "../../../bin/opt/bin");

const vscodeHtmlStyle = `--vscode-activityBar-activeBorder:#ffffff; --vscode-activityBar-background:#333333; --vscode-activityBar-dropBackground:rgba(255, 255, 255, 0.12); --vscode-activityBar-foreground:#ffffff; --vscode-activityBar-inactiveForeground:rgba(255, 255, 255, 0.4); --vscode-activityBarBadge-background:#007acc; --vscode-activityBarBadge-foreground:#ffffff; --vscode-badge-background:#4d4d4d; --vscode-badge-foreground:#ffffff; --vscode-bookmarks-lineBackground:rgba(0, 0, 0, 0); --vscode-bookmarks-lineBorder:rgba(0, 0, 0, 0); --vscode-bookmarks-overviewRuler:rgba(21, 126, 251, 0.53); --vscode-breadcrumb-activeSelectionForeground:#e0e0e0; --vscode-breadcrumb-background:#1e1e1e; --vscode-breadcrumb-focusForeground:#e0e0e0; --vscode-breadcrumb-foreground:rgba(204, 204, 204, 0.8); --vscode-breadcrumbPicker-background:#252526; --vscode-button-background:#0e639c; --vscode-button-foreground:#ffffff; --vscode-button-hoverBackground:#1177bb; --vscode-checkbox-background:#3c3c3c; --vscode-checkbox-border:#3c3c3c; --vscode-checkbox-foreground:#f0f0f0; --vscode-debugExceptionWidget-background:#420b0d; --vscode-debugExceptionWidget-border:#a31515; --vscode-debugIcon-breakpointCurrentStackframeForeground:#ffcc00; --vscode-debugIcon-breakpointDisabledForeground:#848484; --vscode-debugIcon-breakpointForeground:#e51400; --vscode-debugIcon-breakpointStackframeForeground:#89d185; --vscode-debugIcon-breakpointUnverifiedForeground:#848484; --vscode-debugIcon-continueForeground:#75beff; --vscode-debugIcon-disconnectForeground:#f48771; --vscode-debugIcon-pauseForeground:#75beff; --vscode-debugIcon-restartForeground:#89d185; --vscode-debugIcon-startForeground:#89d185; --vscode-debugIcon-stepBackForeground:#75beff; --vscode-debugIcon-stepIntoForeground:#75beff; --vscode-debugIcon-stepOutForeground:#75beff; --vscode-debugIcon-stepOverForeground:#75beff; --vscode-debugIcon-stopForeground:#f48771; --vscode-debugTokenExpression-boolean:#4e94ce; --vscode-debugTokenExpression-error:#f48771; --vscode-debugTokenExpression-name:#c586c0; --vscode-debugTokenExpression-number:#b5cea8; --vscode-debugTokenExpression-string:#ce9178; --vscode-debugTokenExpression-value:rgba(204, 204, 204, 0.6); --vscode-debugToolBar-background:#333333; --vscode-debugView-exceptionLabelBackground:#6c2022; --vscode-debugView-exceptionLabelForeground:#cccccc; --vscode-debugView-stateLabelBackground:rgba(136, 136, 136, 0.27); --vscode-debugView-stateLabelForeground:#cccccc; --vscode-debugView-valueChangedHighlight:#569cd6; --vscode-descriptionForeground:rgba(204, 204, 204, 0.7); --vscode-diffEditor-diagonalFill:rgba(204, 204, 204, 0.2); --vscode-diffEditor-insertedTextBackground:rgba(155, 185, 85, 0.2); --vscode-diffEditor-removedTextBackground:rgba(255, 0, 0, 0.2); --vscode-dropdown-background:#3c3c3c; --vscode-dropdown-border:#3c3c3c; --vscode-dropdown-foreground:#f0f0f0; --vscode-editor-background:#1e1e1e; --vscode-editor-findMatchBackground:#515c6a; --vscode-editor-findMatchHighlightBackground:rgba(234, 92, 0, 0.33); --vscode-editor-findRangeHighlightBackground:rgba(58, 61, 65, 0.4); --vscode-editor-focusedStackFrameHighlightBackground:rgba(122, 189, 122, 0.3); --vscode-editor-foldBackground:rgba(38, 79, 120, 0.3); --vscode-editor-font-family:Consolas, &quot;Courier New&quot;, monospace; --vscode-editor-font-size:14px; --vscode-editor-font-weight:normal; --vscode-editor-foreground:#d4d4d4; --vscode-editor-hoverHighlightBackground:rgba(38, 79, 120, 0.25); --vscode-editor-inactiveSelectionBackground:#3a3d41; --vscode-editor-lineHighlightBorder:#282828; --vscode-editor-rangeHighlightBackground:rgba(255, 255, 255, 0.04); --vscode-editor-selectionBackground:#264f78; --vscode-editor-selectionHighlightBackground:rgba(173, 214, 255, 0.15); --vscode-editor-snippetFinalTabstopHighlightBorder:#525252; --vscode-editor-snippetTabstopHighlightBackground:rgba(124, 124, 124, 0.3); --vscode-editor-stackFrameHighlightBackground:rgba(255, 255, 0, 0.2); --vscode-editor-symbolHighlightBackground:rgba(234, 92, 0, 0.33); --vscode-editor-wordHighlightBackground:rgba(87, 87, 87, 0.72); --vscode-editor-wordHighlightStrongBackground:rgba(0, 73, 114, 0.72); --vscode-editorActiveLineNumber-foreground:#c6c6c6; --vscode-editorBracketMatch-background:rgba(0, 100, 0, 0.1); --vscode-editorBracketMatch-border:#888888; --vscode-editorCodeLens-foreground:#999999; --vscode-editorCursor-foreground:#aeafad; --vscode-editorError-foreground:#f48771; --vscode-editorGroup-border:#444444; --vscode-editorGroup-dropBackground:rgba(83, 89, 93, 0.5); --vscode-editorGroupHeader-noTabsBackground:#1e1e1e; --vscode-editorGroupHeader-tabsBackground:#252526; --vscode-editorGutter-addedBackground:#587c0c; --vscode-editorGutter-background:#1e1e1e; --vscode-editorGutter-commentRangeForeground:#c5c5c5; --vscode-editorGutter-deletedBackground:#94151b; --vscode-editorGutter-foldingControlForeground:#c5c5c5; --vscode-editorGutter-modifiedBackground:#0c7d9d; --vscode-editorHint-foreground:rgba(238, 238, 238, 0.7); --vscode-editorHoverWidget-background:#252526; --vscode-editorHoverWidget-border:#454545; --vscode-editorHoverWidget-foreground:#cccccc; --vscode-editorHoverWidget-statusBarBackground:#2c2c2d;
--vscode-editorIndentGuide-activeBackground:#707070; --vscode-editorIndentGuide-background:#404040; --vscode-editorInfo-foreground:#75beff; --vscode-editorLightBulb-foreground:#ffcc00; --vscode-editorLightBulbAutoFix-foreground:#75beff; --vscode-editorLineNumber-activeForeground:#c6c6c6; --vscode-editorLineNumber-foreground:#858585; --vscode-editorLink-activeForeground:#4e94ce; --vscode-editorMarkerNavigation-background:#2d2d30; --vscode-editorMarkerNavigationError-background:#f48771; --vscode-editorMarkerNavigationInfo-background:#75beff; --vscode-editorMarkerNavigationWarning-background:#cca700; --vscode-editorOverviewRuler-addedForeground:rgba(88, 124, 12, 0.6); --vscode-editorOverviewRuler-border:rgba(127, 127, 127, 0.3); --vscode-editorOverviewRuler-bracketMatchForeground:#a0a0a0; --vscode-editorOverviewRuler-commonContentForeground:rgba(96, 96, 96, 0.4); --vscode-editorOverviewRuler-currentContentForeground:rgba(64, 200, 174, 0.5); --vscode-editorOverviewRuler-deletedForeground:rgba(148, 21, 27, 0.6); --vscode-editorOverviewRuler-errorForeground:rgba(255, 18, 18, 0.7); --vscode-editorOverviewRuler-findMatchForeground:rgba(209, 134, 22, 0.49); --vscode-editorOverviewRuler-incomingContentForeground:rgba(64, 166, 255, 0.5); --vscode-editorOverviewRuler-infoForeground:#75beff; --vscode-editorOverviewRuler-modifiedForeground:rgba(12, 125, 157, 0.6); --vscode-editorOverviewRuler-rangeHighlightForeground:rgba(0, 122, 204, 0.6); --vscode-editorOverviewRuler-selectionHighlightForeground:rgba(160, 160, 160, 0.8); --vscode-editorOverviewRuler-warningForeground:#cca700; --vscode-editorOverviewRuler-wordHighlightForeground:rgba(160, 160, 160, 0.8); --vscode-editorOverviewRuler-wordHighlightStrongForeground:rgba(192, 160, 192, 0.8); --vscode-editorPane-background:#1e1e1e; --vscode-editorRuler-foreground:#5a5a5a; --vscode-editorSuggestWidget-background:#252526; --vscode-editorSuggestWidget-border:#454545; --vscode-editorSuggestWidget-foreground:#d4d4d4; --vscode-editorSuggestWidget-highlightForeground:#0097fb; --vscode-editorSuggestWidget-selectedBackground:#062f4a; --vscode-editorUnnecessaryCode-opacity:rgba(0, 0, 0, 0.67); --vscode-editorWarning-foreground:#cca700; --vscode-editorWhitespace-foreground:rgba(227, 228, 226, 0.16); --vscode-editorWidget-background:#252526; --vscode-editorWidget-border:#454545; --vscode-editorWidget-foreground:#cccccc; --vscode-errorForeground:#f48771; --vscode-extensionBadge-remoteBackground:#007acc; --vscode-extensionBadge-remoteForeground:#ffffff; --vscode-extensionButton-prominentBackground:#327e36; --vscode-extensionButton-prominentForeground:#ffffff; --vscode-extensionButton-prominentHoverBackground:#28632b; --vscode-focusBorder:rgba(14, 99, 156, 0.8); --vscode-font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe WPC&quot;, &quot;Segoe UI&quot;, &quot;Ubuntu&quot;, &quot;Droid Sans&quot;, sans-serif; --vscode-font-size:13px; --vscode-font-weight:normal; --vscode-foreground:#cccccc; --vscode-gitDecoration-addedResourceForeground:#81b88b; --vscode-gitDecoration-conflictingResourceForeground:#6c6cc4; --vscode-gitDecoration-deletedResourceForeground:#c74e39; --vscode-gitDecoration-ignoredResourceForeground:#8c8c8c; --vscode-gitDecoration-modifiedResourceForeground:#e2c08d; --vscode-gitDecoration-submoduleResourceForeground:#8db9e2; --vscode-gitDecoration-untrackedResourceForeground:#73c991; --vscode-icon-foreground:#c5c5c5; --vscode-imagePreview-border:rgba(128, 128, 128, 0.35); --vscode-input-background:#3c3c3c; --vscode-input-foreground:#cccccc; --vscode-input-placeholderForeground:#a6a6a6; --vscode-inputOption-activeBackground:rgba(14, 99, 156, 0.4); --vscode-inputOption-activeBorder:rgba(0, 122, 204, 0); --vscode-inputValidation-errorBackground:#5a1d1d; --vscode-inputValidation-errorBorder:#be1100; --vscode-inputValidation-infoBackground:#063b49; --vscode-inputValidation-infoBorder:#007acc; --vscode-inputValidation-warningBackground:#352a05; --vscode-inputValidation-warningBorder:#b89500; --vscode-list-activeSelectionBackground:#094771; --vscode-list-activeSelectionForeground:#ffffff; --vscode-list-deemphasizedForeground:#8c8c8c; --vscode-list-dropBackground:#383b3d; --vscode-list-errorForeground:#f88070; --vscode-list-filterMatchBackground:rgba(234, 92, 0, 0.33); --vscode-list-focusBackground:#062f4a; --vscode-list-highlightForeground:#0097fb; --vscode-list-hoverBackground:#2a2d2e; --vscode-list-inactiveSelectionBackground:#37373d; --vscode-list-invalidItemForeground:#b89500; --vscode-list-warningForeground:#cca700; --vscode-listFilterWidget-background:#653723; --vscode-listFilterWidget-noMatchesOutline:#be1100; --vscode-listFilterWidget-outline:rgba(0, 0, 0, 0); --vscode-menu-background:#252526; --vscode-menu-foreground:#cccccc; --vscode-menu-selectionBackground:#094771; --vscode-menu-selectionForeground:#ffffff; --vscode-menu-separatorBackground:#bbbbbb; --vscode-menubar-selectionBackground:rgba(255, 255, 255, 0.1); --vscode-menubar-selectionForeground:#cccccc; --vscode-merge-commonContentBackground:rgba(96, 96, 96, 0.16); --vscode-merge-commonHeaderBackground:rgba(96, 96, 96, 0.4); --vscode-merge-currentContentBackground:rgba(64, 200, 174, 0.2);
--vscode-merge-currentHeaderBackground:rgba(64, 200, 174, 0.5); --vscode-merge-incomingContentBackground:rgba(64, 166, 255, 0.2); --vscode-merge-incomingHeaderBackground:rgba(64, 166, 255, 0.5); --vscode-minimap-errorHighlight:rgba(255, 18, 18, 0.7); --vscode-minimap-findMatchHighlight:#d18616; --vscode-minimap-selectionHighlight:#264f78; --vscode-minimap-warningHighlight:#cca700; --vscode-minimapGutter-addedBackground:#587c0c; --vscode-minimapGutter-deletedBackground:#94151b; --vscode-minimapGutter-modifiedBackground:#0c7d9d; --vscode-minimapSlider-activeBackground:rgba(191, 191, 191, 0.2); --vscode-minimapSlider-background:rgba(121, 121, 121, 0.2); --vscode-minimapSlider-hoverBackground:rgba(100, 100, 100, 0.35); --vscode-notebook-cellToolbarSeperator:rgba(128, 128, 128, 0.35); --vscode-notebook-focusedCellIndicator:#0c7d9d; --vscode-notebook-outputContainerBackgroundColor:rgba(255, 255, 255, 0.06); --vscode-notificationCenterHeader-background:#303031; --vscode-notificationLink-foreground:#3794ff; --vscode-notifications-background:#252526; --vscode-notifications-border:#303031; --vscode-notifications-foreground:#cccccc; --vscode-notificationsErrorIcon-foreground:#f48771; --vscode-notificationsInfoIcon-foreground:#75beff; --vscode-notificationsWarningIcon-foreground:#cca700; --vscode-panel-background:#1e1e1e; --vscode-panel-border:rgba(128, 128, 128, 0.35); --vscode-panel-dropBackground:rgba(255, 255, 255, 0.12); --vscode-panelTitle-activeBorder:#e7e7e7; --vscode-panelTitle-activeForeground:#e7e7e7; --vscode-panelTitle-inactiveForeground:rgba(231, 231, 231, 0.6); --vscode-peekView-border:#007acc; --vscode-peekViewEditor-background:#001f33; --vscode-peekViewEditor-matchHighlightBackground:rgba(255, 143, 0, 0.6); --vscode-peekViewEditorGutter-background:#001f33; --vscode-peekViewResult-background:#252526; --vscode-peekViewResult-fileForeground:#ffffff; --vscode-peekViewResult-lineForeground:#bbbbbb; --vscode-peekViewResult-matchHighlightBackground:rgba(234, 92, 0, 0.3); --vscode-peekViewResult-selectionBackground:rgba(51, 153, 255, 0.2); --vscode-peekViewResult-selectionForeground:#ffffff; --vscode-peekViewTitle-background:#1e1e1e; --vscode-peekViewTitleDescription-foreground:rgba(204, 204, 204, 0.7); --vscode-peekViewTitleLabel-foreground:#ffffff; --vscode-pickerGroup-border:#3f3f46; --vscode-pickerGroup-foreground:#3794ff; --vscode-problemsErrorIcon-foreground:#f48771; --vscode-problemsInfoIcon-foreground:#75beff; --vscode-problemsWarningIcon-foreground:#cca700; --vscode-progressBar-background:#0e70c0; --vscode-quickInput-background:#252526; --vscode-quickInput-foreground:#cccccc; --vscode-quickInputTitle-background:rgba(255, 255, 255, 0.1); --vscode-scrollbar-shadow:#000000; --vscode-scrollbarSlider-activeBackground:rgba(191, 191, 191, 0.4); --vscode-scrollbarSlider-background:rgba(121, 121, 121, 0.4); --vscode-scrollbarSlider-hoverBackground:rgba(100, 100, 100, 0.7); --vscode-searchEditor-findMatchBackground:rgba(234, 92, 0, 0.22); --vscode-settings-checkboxBackground:#3c3c3c; --vscode-settings-checkboxBorder:#3c3c3c; --vscode-settings-checkboxForeground:#f0f0f0; --vscode-settings-dropdownBackground:#3c3c3c; --vscode-settings-dropdownBorder:#3c3c3c; --vscode-settings-dropdownForeground:#f0f0f0; --vscode-settings-dropdownListBorder:#454545; --vscode-settings-headerForeground:#e7e7e7; --vscode-settings-modifiedItemIndicator:#0c7d9d; --vscode-settings-numberInputBackground:#292929; --vscode-settings-numberInputForeground:#cccccc; --vscode-settings-textInputBackground:#292929; --vscode-settings-textInputForeground:#cccccc; --vscode-sideBar-background:#252526; --vscode-sideBar-dropBackground:rgba(255, 255, 255, 0.12); --vscode-sideBarSectionHeader-background:rgba(0, 0, 0, 0); --vscode-sideBarSectionHeader-border:rgba(204, 204, 204, 0.2); --vscode-sideBarTitle-foreground:#bbbbbb; --vscode-statusBar-background:#007acc; --vscode-statusBar-debuggingBackground:#cc6633; --vscode-statusBar-debuggingForeground:#ffffff; --vscode-statusBar-foreground:#ffffff; --vscode-statusBar-noFolderBackground:#68217a; --vscode-statusBar-noFolderForeground:#ffffff; --vscode-statusBarItem-activeBackground:rgba(255, 255, 255, 0.18); --vscode-statusBarItem-hoverBackground:rgba(255, 255, 255, 0.12); --vscode-statusBarItem-prominentBackground:rgba(0, 0, 0, 0.5); --vscode-statusBarItem-prominentForeground:#ffffff; --vscode-statusBarItem-prominentHoverBackground:rgba(0, 0, 0, 0.3); --vscode-statusBarItem-remoteBackground:#16825d; --vscode-statusBarItem-remoteForeground:#ffffff; --vscode-symbolIcon-arrayForeground:#cccccc; --vscode-symbolIcon-booleanForeground:#cccccc; --vscode-symbolIcon-classForeground:#ee9d28; --vscode-symbolIcon-colorForeground:#cccccc; --vscode-symbolIcon-constantForeground:#cccccc; --vscode-symbolIcon-constructorForeground:#b180d7; --vscode-symbolIcon-enumeratorForeground:#ee9d28; --vscode-symbolIcon-enumeratorMemberForeground:#75beff; --vscode-symbolIcon-eventForeground:#ee9d28; --vscode-symbolIcon-fieldForeground:#75beff; --vscode-symbolIcon-fileForeground:#cccccc; --vscode-symbolIcon-folderForeground:#cccccc; --vscode-symbolIcon-functionForeground:#b180d7; --vscode-symbolIcon-interfaceForeground:#75beff;
--vscode-symbolIcon-keyForeground:#cccccc; --vscode-symbolIcon-keywordForeground:#cccccc; --vscode-symbolIcon-methodForeground:#b180d7; --vscode-symbolIcon-moduleForeground:#cccccc; --vscode-symbolIcon-namespaceForeground:#cccccc; --vscode-symbolIcon-nullForeground:#cccccc; --vscode-symbolIcon-numberForeground:#cccccc; --vscode-symbolIcon-objectForeground:#cccccc; --vscode-symbolIcon-operatorForeground:#cccccc; --vscode-symbolIcon-packageForeground:#cccccc; --vscode-symbolIcon-propertyForeground:#cccccc; --vscode-symbolIcon-referenceForeground:#cccccc; --vscode-symbolIcon-snippetForeground:#cccccc; --vscode-symbolIcon-stringForeground:#cccccc; --vscode-symbolIcon-structForeground:#cccccc; --vscode-symbolIcon-textForeground:#cccccc; --vscode-symbolIcon-typeParameterForeground:#cccccc; --vscode-symbolIcon-unitForeground:#cccccc; --vscode-symbolIcon-variableForeground:#75beff; --vscode-tab-activeBackground:#1e1e1e; --vscode-tab-activeForeground:#ffffff; --vscode-tab-activeModifiedBorder:#3399cc; --vscode-tab-border:#252526; --vscode-tab-inactiveBackground:#2d2d2d; --vscode-tab-inactiveForeground:rgba(255, 255, 255, 0.5); --vscode-tab-inactiveModifiedBorder:rgba(51, 153, 204, 0.5); --vscode-tab-unfocusedActiveBackground:#1e1e1e; --vscode-tab-unfocusedActiveForeground:rgba(255, 255, 255, 0.5); --vscode-tab-unfocusedActiveModifiedBorder:rgba(51, 153, 204, 0.5); --vscode-tab-unfocusedInactiveBackground:#2d2d2d; --vscode-tab-unfocusedInactiveForeground:rgba(255, 255, 255, 0.25); --vscode-tab-unfocusedInactiveModifiedBorder:rgba(51, 153, 204, 0.25); --vscode-terminal-ansiBlack:#000000; --vscode-terminal-ansiBlue:#2472c8; --vscode-terminal-ansiBrightBlack:#666666; --vscode-terminal-ansiBrightBlue:#3b8eea; --vscode-terminal-ansiBrightCyan:#29b8db; --vscode-terminal-ansiBrightGreen:#23d18b; --vscode-terminal-ansiBrightMagenta:#d670d6; --vscode-terminal-ansiBrightRed:#f14c4c; --vscode-terminal-ansiBrightWhite:#e5e5e5; --vscode-terminal-ansiBrightYellow:#f5f543; --vscode-terminal-ansiCyan:#11a8cd; --vscode-terminal-ansiGreen:#0dbc79; --vscode-terminal-ansiMagenta:#bc3fbc; --vscode-terminal-ansiRed:#cd3131; --vscode-terminal-ansiWhite:#e5e5e5; --vscode-terminal-ansiYellow:#e5e510; --vscode-terminal-border:rgba(128, 128, 128, 0.35); --vscode-terminal-foreground:#cccccc; --vscode-terminal-selectionBackground:rgba(255, 255, 255, 0.25); --vscode-textBlockQuote-background:rgba(127, 127, 127, 0.1); --vscode-textBlockQuote-border:rgba(0, 122, 204, 0.5); --vscode-textCodeBlock-background:rgba(10, 10, 10, 0.4); --vscode-textLink-activeForeground:#3794ff; --vscode-textLink-foreground:#3794ff; --vscode-textPreformat-foreground:#d7ba7d; --vscode-textSeparator-foreground:rgba(255, 255, 255, 0.18); --vscode-titleBar-activeBackground:#3c3c3c; --vscode-titleBar-activeForeground:#cccccc; --vscode-titleBar-inactiveBackground:rgba(60, 60, 60, 0.6); --vscode-titleBar-inactiveForeground:rgba(204, 204, 204, 0.6); --vscode-tree-indentGuidesStroke:#585858; --vscode-widget-shadow:#000000;`;
const vscodeStyle = `<style id="_defaultStyles">
	body {
		background-color: var(--vscode-editor-background);
		color: var(--vscode-editor-foreground);
		font-family: var(--vscode-font-family);
		font-weight: var(--vscode-font-weight);
		font-size: var(--vscode-font-size);
		margin: 0;
		padding: 0 20px;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	a {
		color: var(--vscode-textLink-foreground);
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
	}

	a:focus,
	input:focus,
	select:focus,
	textarea:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}

	code {
		color: var(--vscode-textPreformat-foreground);
	}

	blockquote {
		background: var(--vscode-textBlockQuote-background);
		border-color: var(--vscode-textBlockQuote-border);
	}

	kbd {
		color: var(--vscode-editor-foreground);
		border-radius: 3px;
		vertical-align: middle;
		padding: 1px 3px;

		background-color: hsla(0,0%,50%,.17);
		border: 1px solid rgba(71,71,71,.4);
		border-bottom-color: rgba(88,88,88,.4);
		box-shadow: inset 0 -1px 0 rgba(88,88,88,.4);
	}
	.vscode-light kbd {
		background-color: hsla(0,0%,87%,.5);
		border: 1px solid hsla(0,0%,80%,.7);
		border-bottom-color: hsla(0,0%,73%,.7);
		box-shadow: inset 0 -1px 0 hsla(0,0%,73%,.7);
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-corner {
		background-color: var(--vscode-editor-background);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--vscode-scrollbarSlider-background);
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--vscode-scrollbarSlider-hoverBackground);
	}
	::-webkit-scrollbar-thumb:active {
		background-color: var(--vscode-scrollbarSlider-activeBackground);
	}</style>`;

function htmlPage(title: string, scripts: string[], profiles: string) {
	let html = `<!DOCTYPE html>
	<html lang="en" style="${vscodeHtmlStyle}">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${title}</title>
		<link rel="shortcut icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABdAElMP2v7/H62RTg/a/v8IbX9HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtfyP/ENr+gw/a/v8Q2v6DD9r+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQgwD/kIMA/5CDAP8P2v7/D9r+/w/a/v8P2v7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQgwD/kIMA/5CDAP+QgwD/AAAAAADC/f8Awv3+AML9/wDC/f4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwHUA/8B1AP/AdQD/AAAAAAAAAAAAAAAAAML9/wDC/f8Awv3/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACh//8Aof//AKH//wCh//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKH//wCh//8Aof//AKH//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkP//AJD//wCQ//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJD//wCQ//8AkP//AJD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbPP/AGzz/wBs8/8AbPP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs8/8AbPP/AGzz/wBt8zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQdxMAEHc/wBB3P8AQdz/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB3P8AQdz/AEHc/wBB3P8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD1/wAA4P8AAMB/AACEPwAAjj8AAP4fAAD/DwAA/48AAP+HAAD/wwAA/+MAAP/xAAD/8AAA//8AAA==" />
		${vscodeStyle}
		<script type="text/javascript">
			const acquireVsCodeApi = (function() {
				const originalPostMessage = window.parent.postMessage.bind(window.parent);
				const targetOrigin = '*';
				let acquired = false;

				let state = {bounds:{minX:0,maxX:1}};

				return () => {
					if (acquired && !undefined) {
						throw new Error('An instance of the VS Code API has already been acquired');
					}
					acquired = true;
					return Object.freeze({
						postMessage: function(msg) {
							return originalPostMessage({ command: 'onmessage', data: msg }, targetOrigin);
						},
						setState: function(newState) {
							state = newState;
							originalPostMessage({ command: 'do-update-state', data: JSON.stringify(newState) }, targetOrigin);
							return newState;
						},
						getState: function() {
							return state;
						}
					});
				};
			})();
			delete window.parent;
			delete window.top;
			delete window.frameElement;
		</script>
	</head>
	<body>
			<script>
				let PROFILES = [];
				let MODELS = [];
				let PROFILE_URL = "${profiles}";
			</script>
	`;
	for(const script of scripts)
		html += `<script src="${script}"></script>\n`;
	html += `
	</body>
	</html>
	`;

	return html;
}

function makeDirs() {
	try { fs.mkdirSync(testHtmlDir); } catch(e) {}
	try { fs.mkdirSync(testOutDir); } catch(e) {}
}

// open resulting HTML files with npm task "serve" (localhost:8080)

function test_profile_time(base: string, elf: string) {
	makeDirs();
	const profileFile = new ProfileFile(path.join(testDataDir, base));
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, elf), symbolTable);
	symbolTable.relocate(symbolTable.getRelocatedSections(profileFile.sectionBases));

	const profiler = new Profiler(sourceMap, symbolTable);
	const json = profiler.profileTime(profileFile, Disassemble(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf)));
	fs.writeFileSync(path.join(testOutDir, base + '.time.amigaprofile'), json);
	const html = htmlPage(base, [ "client.js" ], "data/" + base + ".time.amigaprofile");
	fs.writeFileSync(path.join(testHtmlDir, base + '.time.amigaprofile.html'), html);
}

function test_profile_size(base: string, elf: string) {
	makeDirs();
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, elf), symbolTable);
	const profiler = new Profiler(sourceMap, symbolTable);
	const json = profiler.profileSize(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	fs.writeFileSync(path.join(testOutDir, base + '.size.amigaprofile'), json);
	const html = htmlPage(base, [ "client.js" ], "data/" + base + ".size.amigaprofile");
	fs.writeFileSync(path.join(testHtmlDir, base + '.size.amigaprofile.html'), html);
}

function test_profile_shrinkler(base: string) {
	makeDirs();
	const data = fs.readFileSync(path.join(testDataDir, base + '.shrinklerstats'));
	fs.writeFileSync(path.join(testOutDir, base + '.shrinklerstats'), data);
	const html = htmlPage(base, [ "client.js" ], "data/" + base + ".shrinklerstats");
	fs.writeFileSync(path.join(testHtmlDir, base + '.shrinklerstats.html'), html);
}

function test_unwind(elf: string) {
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const unwindTable = new UnwindTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf), symbolTable);
}

function test_profile_savestate(base: string) {
	makeDirs();
	const profileArchive = new ProfileFile(path.join(testDataDir, base));
	const profiler = new Profiler(null, null);
	fs.writeFileSync(path.join(testOutDir, base + ".amigaprofile"), profiler.profileSavestate(profileArchive));
	const html = htmlPage(base, [ "client.js" ], "data/" + base + ".amigaprofile");
	fs.writeFileSync(path.join(testHtmlDir, base + '.amigaprofile.html'), html);
}

suite("Profiler", () => {
/*	test("unwind bobble.debug.elf", () => {
		test_unwind('private/bobble.debug.elf');
	});
	test("unwind test.elf", () => {
		test_unwind('test.elf');
	});
	test("unwind bitshmup.elf", () => {
		test_unwind('private/bitshmup.elf');
	});
	test("Time: test.elf A500", () => {
		test_profile_time('amiga-profile-2020.08.18-21.34.52_A500', 'test.elf');
	});
	test("Time: test.elf A1200", () => {
		test_profile_time('amiga-profile-2020.08.18-21.31.05_A1200', 'test.elf');
	});*/
	test("Size: test.elf", () => {
		test_profile_size('test', 'test.elf');
	});

/*	test("Time: test2.elf", () => {
		test_profile_time('amiga-profile-1590418304029', 'test2.elf');
	});
	test("bitshmup.elf", () => {
		test_profile('amiga-profile-1589891749803', 'private/bitshmup.elf');
	});
	test("Time: bobble.debug.elf", () => {
		test_profile_time('amiga-profile-2020.07.22-13.46.24', 'private/bobble.debug.elf');
	});
	test("Size: bitshmup.elf", () => {
		test_profile_size('bitshmup', 'private/bitshmup.elf');
	});*/
	test("Shrinkler: bobble.shrinklerstats", () => {
		test_profile_shrinkler('bobble');
	});

/*	test("Savestate: desertdream-dots.profile", () => {
		test_profile_savestate('desertdream-dots.profile');
	});*/
});
