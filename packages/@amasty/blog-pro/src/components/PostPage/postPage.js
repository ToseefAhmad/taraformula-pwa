import React, {Fragment, useRef} from 'react';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Image from '@magento/venia-ui/lib/components/Image';
import Features from '../Features';
import PostTags from '../PostTags';
import Comments from '../Comments';
import RelatedPosts from '../RelatedPosts';
import defaultClasses from './post.css';
import RichText from '@magento/venia-ui/lib/components/RichText';
import SocialButtons from '../SocialButtons';
import {formatDate, getURL} from '../../utils';
import {BLOG_URLS_BY_SECTION} from '../../constants';
import {Redirect} from 'react-router-dom';
import {Title, Meta, Link} from '@magento/venia-ui/lib/components/Head';
import Breadcrumbs from '../Breadcrumbs/breadcrumbs';
import {Printer as PrintIcon} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import {useAmBlogProContext} from '../../context';
import Button from '@magento/venia-ui/lib/components/Button';
import Vote from '../Vote';
import {usePost} from '../../talons/usePost';

const DEFAULT_IMAGE_WIDTH = 640;
const DEFAULT_IMAGE_HEIGHT = 430;

const PostPage = props => {
    const commentsRef = useRef(null);
    const {settings} = useAmBlogProContext();
    const {loading, error, post} = usePost({commentsRef});

    if (loading) {
        return <LoadingIndicator/>;
    }

    if (error) {
        return <Redirect to={'/404.html'}/>;
    }

    if (!post) {
        return null;
    }

    const {
        post_id,
        url_key: postUrl,
        post_thumbnail: postThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        tag_ids,
        title,
        full_content: fullContent,
        published_at: date,
        comments_enabled,
        related_post_ids: relatedPostIds,
        meta_description,
        meta_tags,
        meta_title,
        canonical_url
    } = post;

    const classes = mergeClasses(defaultClasses, props.classes);
    const url = getURL(BLOG_URLS_BY_SECTION.POST, postUrl);

    const {
        post_display_print,
        post_date_manner,
        post_image_width,
        post_image_height,
        social_enabled,
        post_helpful,
        comments_use_comments
    } = settings || {};

    const comments =
        comments_use_comments && Number(comments_enabled) ? (
            <div ref={commentsRef}>
                <Comments postId={Number(post_id)}/>
            </div>
        ) : null;

    return (
        <Fragment>
            <Title>{meta_title || title}</Title>
            <Meta name="description" content={meta_description}/>
            <Meta name="tags" content={meta_tags}/>
            <Link rel="canonical" href={canonical_url}/>

            <Breadcrumbs
                pageTitle={title}
                classes={{gridArea: classes.breadcrumbs}}
            />

            <div className={classes.main}>
                {postThumbnail && (
                    <div className={classes.images}>
                        <Image
                            alt={postThumbnailAlt}
                            classes={{
                                image: classes.image,
                                root: classes.imageContainer
                            }}
                            src={postThumbnail}
                            width={post_image_width || DEFAULT_IMAGE_WIDTH}
                            height={post_image_height || DEFAULT_IMAGE_HEIGHT}
                        />
                    </div>
                )}

                <PostTags tagIds={tag_ids}/>

                <Features post={post} postUrl={url}/>
                <h1 className={classes.title}>{title}</h1>

                <div className={classes.date}>{formatDate(date, post_date_manner)}</div>

                <RichText classes={{root: classes.content}} content={fullContent}/>

                <div className={classes.footer}>
                    {social_enabled && (
                        <SocialButtons
                            title={meta_title}
                            description={meta_description}
                            url={url}
                            image={postThumbnail}
                        />
                    )}

                    {post_helpful && post_id && <Vote postId={post_id}/>}

                    {post_display_print && (
                        <Button
                            type="button"
                            className={classes.printButton}
                            title="Print This Page"
                            onClick={window.print}
                        >
                            <Icon src={PrintIcon} classes={{root: classes.printIcon}}/>
                            <span>Print</span>
                        </Button>
                    )}
                </div>

                {comments}

                <RelatedPosts relatedPostIds={relatedPostIds}/>
            </div>
        </Fragment>
    );
};

export default PostPage;
