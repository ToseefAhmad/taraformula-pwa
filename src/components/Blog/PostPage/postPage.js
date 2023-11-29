import Vote from '@amasty/blog-pro/src/components/Vote';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import React, { useRef, useEffect } from 'react';
import { Printer as PrintIcon } from 'react-feather';
import { Redirect } from 'react-router-dom';

import ArticleRichSnippet from '@app/components/ArticleRichSnippet/articleRichSnippet';
import { useAmBlogProContext } from '@app/components/Blog/context';
import AuthorLink from '@app/components/Blog/PostPage/authorLink';
import PostTags from '@app/components/Blog/PostTags';
import PreviousNextNavigation from '@app/components/Blog/PreviousNextNavigation';
import RelatedPosts from '@app/components/Blog/RelatedPosts';
import RelatedProducts from '@app/components/Blog/RelatedProducts';
import SocialButtons from '@app/components/Blog/SocialButtons';
import { getShortDateFormat } from '@app/components/Blog/time';
import Hreflangs from '@app/components/Hreflangs';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { usePost } from '@app/talons/usePost';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle, Meta, Link } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './post.module.css';

const DEFAULT_IMAGE_WIDTH = 640;
const DEFAULT_IMAGE_HEIGHT = 430;

const PostPage = () => {
    const commentsRef = useRef(null);
    const { settings, getAuthorById } = useAmBlogProContext();
    const { loading, error, post, blogHreflangs } = usePost({ commentsRef });
    const { isMobileScreen, isTabletScreen } = useScreenSize();

    useEffect(() => {
        const timmer = setInterval(() => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
                window.__igEmbedLoaded = function() {
                    clearInterval(timmer);
                };
            }
        }, 300);
    }, []);

    if (error) {
        return <Redirect to={'/404.html'} />;
    }

    if (!post) {
        return null;
    }

    const {
        post_id: postId,
        url_key: postUrl,
        post_thumbnail: postThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        tag_ids: tagIds,
        title,
        full_content: fullContent,
        published_at: date,
        related_post_ids: relatedPostIds,
        meta_description: metaDescription,
        meta_tags: metaTags,
        meta_title: metaTitle,
        author_id: authorId,
        photography_author_id: photographyAuthorId,
        next,
        previous,
        canonical_full_url
    } = post;

    const writeAuthor = getAuthorById(authorId);
    const photographyAuthor = getAuthorById(photographyAuthorId);
    const formatDate = getShortDateFormat(date);
    const url = getURL(BLOG_URLS_BY_SECTION.POST, postUrl);
    const {
        post_display_print: postDisplayPrint,
        post_image_width: postImageWidth,
        post_image_height: postImageHeight,
        social_enabled: socialEnabled,
        post_helpful: postHelpful,
        post_related_products_block_title: relatedProductTitle,
        product_related_posts_tab_title: relatedPostTitle
    } = settings || {};

    const desktopAuthor = loading ? (
        <div className={classes.postHead}>
            <Shimmer width={'100px'} height={'24px'} />
            <Shimmer width={'100px'} height={'24px'} />
            <Shimmer width={'100px'} height={'24px'} />
        </div>
    ) : (
        <div className={classes.postHead}>
            <span className={classes.desktopAuthor}>
                <AuthorLink className={classes.desktopAuthor} author={writeAuthor} isWordAuthor={true} />
            </span>
            <span className={classes.date}>{formatDate}</span>
            <span className={classes.desktopAuthor}>
                <AuthorLink className={classes.desktopAuthor} author={photographyAuthor} />
            </span>
        </div>
    );
    const postTitle = loading ? (
        isMobileScreen || isTabletScreen ? (
            <Shimmer width={'100%'} height={'64px'} style={{ marginTop: '5px', marginBottom: '20px' }} />
        ) : (
            <Shimmer width={'100%'} height={'144px'} style={{ marginTop: '10px', marginBottom: '15px' }} />
        )
    ) : (
        <h1 className={classes.title}>{title}</h1>
    );
    const postTagContent =
        loading && tagIds ? (
            <Shimmer width={'300px'} height={'24px'} style={{ marginTop: '10px' }} />
        ) : (
            <PostTags tagIds={tagIds} />
        );
    const mobileAuthor = loading ? (
        <div className={classes.mobileAuthor}>
            <Shimmer width={'100px'} height={'16px'} />
            <Shimmer width={'100px'} height={'16px'} />
        </div>
    ) : (
        <div className={classes.mobileAuthor}>
            <AuthorLink author={writeAuthor} isWordAuthor={true} />
            <AuthorLink author={photographyAuthor} />
        </div>
    );
    const postImgContent = loading ? (
        <div className={classes.images}>
            <Shimmer width={'100%'} height={isMobileScreen ? '390px' : '660px'} />
        </div>
    ) : (
        <div className={classes.images}>
            <img
                alt={postThumbnailAlt}
                src={postThumbnail}
                width={postImageWidth || DEFAULT_IMAGE_WIDTH}
                height={postImageHeight || DEFAULT_IMAGE_HEIGHT}
            />
        </div>
    );
    const socialContent = loading ? (
        <Shimmer width={'400px'} height={'24px'} />
    ) : (
        <SocialButtons title={metaTitle || title} description={metaDescription} url={url} image={postThumbnail} />
    );

    return (
        <>
            <ArticleRichSnippet />
            <Link rel="canonical" href={canonical_full_url} />
            <StoreTitle>{metaTitle || title}</StoreTitle>
            <Meta name="description" content={metaDescription} />
            <Meta name="tags" content={metaTags} />
            <Hreflangs hreflangs={blogHreflangs} />
            <div className={classes.container}>
                <div className={classes.navigation}>
                    <PreviousNextNavigation loading={loading} links={previous} left={true} />
                </div>
                <div className={classes.main}>
                    {desktopAuthor}
                    {postTitle}
                    {postTagContent}
                    {mobileAuthor}
                    {postThumbnail && postImgContent}
                    <RichContent classes={{ root: classes.blogPostContent }} html={fullContent} />
                    <div className={classes.footer}>
                        {socialEnabled && socialContent}
                        {postHelpful && postId && <Vote postId={postId} />}
                        {postDisplayPrint && (
                            <Button
                                type="button"
                                className={classes.printButton}
                                title="Print This Page"
                                onClick={window.print}
                            >
                                <Icon src={PrintIcon} classes={{ root: classes.printIcon }} />
                                <span>Print</span>
                            </Button>
                        )}
                    </div>
                    <RelatedProducts className={classes.productList} title={relatedProductTitle} postId={postId} />
                </div>
                <div className={classes.navigation}>
                    <PreviousNextNavigation loading={loading} links={next} />
                </div>
            </div>
            <RelatedPosts loadingMainPage={loading} title={relatedPostTitle} relatedPostIds={relatedPostIds} />
        </>
    );
};

export default PostPage;
