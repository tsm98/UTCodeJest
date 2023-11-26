export class Post {
  constructor(
    public title?: string,
    public description?: string,
    public tags?: [string],
    public file?: string,
    public userEmail?: string,
    public postId?: string,
    public comment?: [],
    public likes?: number
  ) {}
}
