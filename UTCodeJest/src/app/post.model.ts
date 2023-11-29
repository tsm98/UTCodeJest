export class Post {
  constructor(
    public title?: string,
    public description?: string,
    public tags?: [string],
    public file?: string,
    public user?: {},
    public postId?: string,
    public comment?: [],
    public likes?: number
  ) {}
}
