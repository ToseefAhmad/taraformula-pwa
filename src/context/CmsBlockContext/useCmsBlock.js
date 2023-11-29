import { gql, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';

const GET_ALL_CMS_BLOCKS = gql`
    query allCmsBlocks {
        allCmsBlocks {
            items {
                content
                identifier
            }
        }
    }
`;

export const useCmsBlock = () => {
    const [loading, setLoading] = useState(true);
    const [cmsBlocks, setCmsBlocks] = useState(false);

    useQuery(GET_ALL_CMS_BLOCKS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            setCmsBlocks((data && data.allCmsBlocks && data.allCmsBlocks.items) || []);
            setLoading(false);
        }
    });

    const getCmsBlocks = useCallback(
        identifiers => {
            if (!cmsBlocks || !cmsBlocks.length) {
                return false;
            }

            identifiers = Array.isArray(identifiers) ? identifiers : [identifiers];

            return cmsBlocks.filter(function(block) {
                return identifiers.indexOf(block.identifier) > -1;
            });
        },
        [cmsBlocks]
    );

    return {
        loading,
        setLoading,
        cmsBlocks,
        setCmsBlocks,
        getCmsBlocks
    };
};
