
export function insertAtCursor(input: HTMLTextAreaElement, text: string) {
	if (window.navigator.userAgent.indexOf('Edge') >= 0) { // Microsoft Edge
		const start = input.selectionStart;
		const end = input.selectionEnd;

		input.value = input.value.substring(0, start) + text + input.value.substring(end, input.value.length);

		const pos = start + text.length;
		input.focus();
		input.setSelectionRange(pos, pos);
	} else if (input.selectionStart || input.selectionStart === 0) {
		const start = input.selectionStart;
		const end = input.selectionEnd;
		input.value = input.value.substring(0, start)
			+ text
			+ input.value.substring(end, input.value.length);
	} else {
		input.value += text;
	}
}
