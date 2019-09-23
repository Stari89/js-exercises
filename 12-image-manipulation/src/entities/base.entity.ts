import Helpers from '../helpers';

export default class BaseEntity {
	constructor(private tags: ITag[]) {}
	public get Tags(): ITag[] {
		return this.tags;
	}
	public getProperty(tagName: string) {
		const tag: ITag = this.tags.find(tag => tag.name === tagName);
		if (!tag || !tag.property) {
			return null;
		}
		return Helpers.getProperty(this, tag.property);
	}
}

export interface ITag {
	name: Tags;
	property: string;
}

export enum Tags {
	Transform = 'transform',
	LabelText = 'label-text',
	MouseState = 'mouse-state',
	MouseScroll = 'mouse-scroll',
	PressedKeys = 'pressed-keys'
}
