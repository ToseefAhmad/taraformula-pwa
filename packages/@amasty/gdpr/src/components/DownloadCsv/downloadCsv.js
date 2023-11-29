import React, { Fragment } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../DownloadCsv/downloadCsv.css';
import { FormattedMessage } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/ButtonGroup/button';
import { CSVLink, CSVDownload } from 'react-csv';
import { array } from 'prop-types';

const DownloadCsv = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { data } = props;

  if (!data.length) {
    return null;
  }

  return (
    <Fragment>
      <CSVDownload target="_blank" data={data} />
      <Button
        classes={{ root_lowPriority: classes.filterButton }}
        disabled={false}
        type="submit"
      >
        <CSVLink data={data}>
          <FormattedMessage
            id={'privacy.downloadFile'}
            defaultMessage={'Download'}
          />
        </CSVLink>
      </Button>
    </Fragment>
  );
};

DownloadCsv.propTypes = {
  data: array
};

export default DownloadCsv;
