import {tagify} from "./tagify";

const tag = tagify('__exposes__');

export const expose = tag.decorator;
export const fetchExposes = tag.fetch;
