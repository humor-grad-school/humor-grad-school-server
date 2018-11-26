const uuidv4 = require('uuid/v4');

interface PostDocument {
    id: string;
    title: string;
    contentId: string;
    writerId: string;
    commentId: string;
}

interface CommentDocument {
    id: string;
    comment: MainComment[];
    nextId: string;
}

interface BaseComment {
    id: string;
    writerId: string;
    contentId: string;
}

interface MainComment extends BaseComment {
    commentsOfComment: BaseComment[];
}

export function post(req, res) {
    // 1. 게시물 생성
    const commentDocument: CommentDocument = {
        id: uuidv4(),
        comment: [],
        nextId: null,
    };

    const postDocument: PostDocument = {
        id: uuidv4(),
        title: req.body.title,
        contentId: req.body.contentId,
        writerId: 'TODO',
        commentId: commentDocument.id,
    };

    // 2. 최신글에 넣기
}