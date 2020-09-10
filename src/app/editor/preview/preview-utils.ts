
export function createCodeDocument(text: string): string {
	const body = document.createElement('body');
	body.style.color = '#000';
	body.style.background = '#FFF';
	body.style.fontSize = '16px';
	const pre = document.createElement('pre');
	pre.innerText = text;
	body.appendChild(pre);
	return body.outerHTML;
}

export function createErrorDocument(message: string): string {
	const code = document.createElement('code');
	code.style.display = 'block';
	code.style.background = 'red';
	code.style.color = 'white';
	code.style.padding = '1rem';
	code.innerText = message;
	return code.outerHTML;
}
