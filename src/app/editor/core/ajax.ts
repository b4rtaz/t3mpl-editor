
export type HttpMethod = 'GET' | 'POST' | 'PUT';

export interface AjaxSettings {
	method: HttpMethod;
	url: string;
	responseType: XMLHttpRequestResponseType;
	timeout?: number;
	contentType?: string;
	file?: Blob | string;
}

export function ajax<T>(s: AjaxSettings): Promise<T> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = s.responseType;
		xhr.timeout = s.timeout;
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(xhr.response as T);
				} else {
					reject(`Invalid response code: ${xhr.status}`);
				}
			}
		};
		xhr.onerror = (e) => reject(e);
		xhr.open(s.method, s.url);
		if (s.contentType) {
			xhr.setRequestHeader('Content-Type', s.contentType);
		}
		if (s.file) {
			xhr.send(s.file);
		} else {
			xhr.send();
		}
	});
}

export function ajaxAsText(method: HttpMethod, url: string): Promise<string> {
	return ajax({
		method,
		url,
		responseType: 'text'
	});
}

export function ajaxAsBase64(method: HttpMethod, url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		ajax({
			method,
			url,
			responseType: 'blob'
		}).then(data => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (e) => {
				reject(e);
			};
			reader.readAsDataURL(data as Blob);
		}, e => reject(e));
	});
}
