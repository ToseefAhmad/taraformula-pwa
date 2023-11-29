import { useAddressApi } from './useAddressApi';

export const useAddressField = ({
    addressId,
    parentId = null,
    parentField = null,
    selectedParentValue = null,
    selectedValue = null
}) => {
    const { GetApiAddressData } = useAddressApi();
    const { fetched, loading, data } = GetApiAddressData(addressId, selectedParentValue, parentId, parentField);

    let formattedData = [];

    if (data) {
        formattedData = data.map(address => ({
            key: address.id,
            label: address.name,
            value: address.name
        }));
    }

    const fieldData = loading ? [{ label: selectedValue, value: selectedValue }] : formattedData;

    return {
        fetched: fetched,
        loading: loading,
        data: fieldData
    };
};
