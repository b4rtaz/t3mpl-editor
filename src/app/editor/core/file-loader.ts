
export class FileLoader {

	public static loadAsDataURL(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = e => reject(e);
			reader.readAsDataURL(file);
		});
	}
}
