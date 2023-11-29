import { arrayOf, shape, string, bool } from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import ReactVideoPlayer from 'react-player/lazy';

import { VideoPlay } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from './video.module.css';

/**
 * Page Builder Video component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Video
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Video using an iframe.
 */
const Video = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        url = '',
        autoplay,
        muted,
        maxWidth,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const mainStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };
    const innerStyles = {
        maxWidth
    };
    const wrapperStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };
    const youtubeRegExp = new RegExp(
        '^(?:https?://|//)?(?:www\\.|m\\.)?' +
            '(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])'
    );
    const vimeoRegExp = new RegExp(
        'https?://(?:www\\.|player\\.)?vimeo.com/(?:channels/' +
            '(?:\\w+/)?|groups/([^/]*)/videos/|album/(\\d+)/video/|video/|)(\\d+)(?:$|/|\\?)'
    );

    const youtubeVideoId = useMemo(() => {
        if (url && url.length) {
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[7].length === 11 ? match[7] : false;
        }
    }, [url]);

    const vimeoVideoId = useMemo(() => {
        if (url && url.length) {
            const match = /vimeo.*\/(\d+)/i.exec(url);
            if (match) {
                return match[1];
            }
        }
    }, [url]);

    const [isVideoLoaded, setVideoLoaded] = useState(false);

    const handleVideoLoading = useCallback(() => {
        setVideoLoaded(true);
    }, [setVideoLoaded]);

    let video = '';

    if (url && url.length && (youtubeRegExp.test(url) || vimeoRegExp.test(url))) {
        video = isVideoLoaded ? (
            <div className={classes.container}>
                <iframe
                    className={classes.video}
                    title={url}
                    frameBorder="0"
                    allowFullScreen="1"
                    loading="lazy"
                    src={url}
                    allow="autoplay; encrypted-media"
                />
            </div>
        ) : (
            <div
                role="button"
                tabIndex={0}
                className={classes.videoWrapper}
                onClick={handleVideoLoading}
                onKeyPress={() => undefined}
            >
                <Icon className={classes.videoIcon} src={VideoPlay} />
                <Image
                    alt={'Video thumbnail'}
                    src={
                        youtubeRegExp.test(url)
                            ? `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`
                            : `https://vumbnail.com/${vimeoVideoId}_medium.jpg`
                    }
                    srcSet={
                        youtubeRegExp.test(url)
                            ? `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg 360w,
                           https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg 768w`
                            : `https://vumbnail.com/${vimeoVideoId}_medium.jpg 360w,
                           https://vumbnail.com/${vimeoVideoId}.jpg 768w,`
                    }
                    classes={{
                        root: classes.videoThumbnailContainer,
                        image: classes.videoThumbnail
                    }}
                />
            </div>
        );
    } else if (url && url.length) {
        video = (
            <div className={classes.container}>
                <ReactVideoPlayer
                    className={classes.video}
                    url={url}
                    autoPlay={autoplay}
                    muted={muted}
                    controls={true}
                />
            </div>
        );
    }

    return video ? (
        <div style={mainStyles} className={[classes.root, ...cssClasses].join(' ')}>
            <div style={innerStyles} className={classes.inner}>
                <div style={wrapperStyles} className={classes.wrapper}>
                    {video}
                </div>
            </div>
        </div>
    ) : null;
};

/**
 * Props for {@link Video}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Video
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} classes.inner CSS classes for the inner container element
 * @property {String} classes.wrapper CSS classes for the wrapper container element
 * @property {String} classes.container CSS classes for the container element
 * @property {String} classes.video CSS classes for the video element
 * @property {String} url URL to render the video from an external provider (YouTube, Vimeo etc)
 * @property {Boolean} autoplay Video autoplay
 * @property {Boolean} muted Video muted
 * @property {String} maxWidth Maximum width of the video
 * @property {String} textAlign Alignment of the video within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Video.propTypes = {
    classes: shape({
        root: string,
        inner: string,
        wrapper: string,
        container: string,
        video: string,
        videoWrapper: string,
        videoIcon: string,
        videoThumbnailContainer: string,
        videoThumbnail: string
    }),
    url: string,
    autoplay: bool,
    muted: bool,
    maxWidth: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Video;
