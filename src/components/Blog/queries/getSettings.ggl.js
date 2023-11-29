import { gql } from '@apollo/client';

export const GET_BLOG_INFO_QUERY = gql`
    query amBlogSetting {
        amBlogSetting {
            display_settings_label
            display_settings_display_at_footer
            display_settings_display_at_toolbar
            display_settings_display_at_category

            search_engine_bread
            search_engine_route
            search_engine_title
            search_engine_title_suffix
            search_engine_meta_title
            search_engine_meta_description
            search_engine_meta_keywords
            search_engine_organization_name

            layout_mobile_list
            layout_mobile_post
            layout_desktop_list
            layout_desktop_post
            list_count_per_page

            post_display_author
            post_display_categories
            post_categories_limit
            post_display_tags
            post_date_manner
            post_image_width
            post_image_height
            post_helpful

            comments_use_comments
            comments_autoapprove
            comments_allow_guests
            comments_record_limit
            comments_display_short
            comments_display_date
            comments_ask_email
            comments_ask_name
            comments_gdpr
            comments_gdpr_text

            recent_posts_record_limit
            recent_posts_display_short
            recent_posts_short_limit
            recent_posts_display_date
            recent_posts_display_image
            recent_posts_image_width
            recent_posts_image_height

            tags_minimal_post_count
            social_enabled
            social_buttons

            post_related_products_block_title
            product_related_posts_tab_title
            previous_next_navigation
            canonical_full_url
        }

        amBlogCategories {
            items {
                category_id
                name
                status
                url_key
                sort_order
                meta_title
                meta_tags
                meta_description
                created_at
                updated_at
                parent_id
                path
                level
                post_count
            }
        }

        amBlogAuthors {
            items {
                author_id
                name
                url_key
                facebook_profile
                twitter_profile
                meta_title
                meta_tags
                meta_description
                external_url
            }
        }

        amBlogTagsWidget {
            items {
                tag_id
                name
                url_key
                meta_title
                meta_tags
                meta_description
            }
        }
    }
`;
