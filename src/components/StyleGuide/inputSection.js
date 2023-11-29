import { Form } from 'informed';
import React from 'react';

import { ArrowRight as ArrowRightIcon } from '@app/components/Icons';
import QuantityFields from '@app/components/overrides/CartPage/ProductListing/quantity';
import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import Newsletter from '@app/components/overrides/Newsletter';
import RadioGroup from '@app/components/overrides/RadioGroup';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './inputSection.module.css';

const InputSection = () => {
    return (
        <div className={classes.root}>
            <div className={classes.columns}>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Inputs</span>
                        <div className={classes.list}>
                            <div className={classes.item}>
                                <Form>
                                    <Field label="Label">
                                        <TextInput field="input" />
                                    </Field>
                                </Form>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field label="Label" optional={true}>
                                        <TextInput field="input" />
                                    </Field>
                                </Form>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field label="Label">
                                        <TextInput field="input" after={<Icon src={ArrowRightIcon} size={30} />} />
                                    </Field>
                                </Form>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="label" label="Label">
                                        <TextInput
                                            field="input"
                                            id="label"
                                            label="Label"
                                            validateOnMount
                                            validate={() => {
                                                return {
                                                    id: 'styleguide.error',
                                                    defaultMessage: 'Error message'
                                                };
                                            }}
                                        />
                                    </Field>
                                </Form>
                            </div>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Dropdown</span>
                        <Form>
                            <Field id="dropdown">
                                <Select
                                    field="dropdown"
                                    items={[
                                        {
                                            key: 's0',
                                            value: 's0',
                                            label: 'Label',
                                            hidden: true
                                        },
                                        { key: 's1', value: 's1', label: 'Select 1' },
                                        { key: 's2', value: 's2', label: 'Select 2' },
                                        { key: 's3', value: 's3', label: 'Select 3' },
                                        { key: 's4', value: 's4', label: 'Select 4', disabled: true },
                                        { key: 's5', value: 's5', label: 'Select 5' },
                                        { key: 's6', value: 's6', label: 'Select 6' },
                                        { key: 's7', value: 's7', label: 'Select 7' },
                                        { key: 's8', value: 's8', label: 'Select 8' }
                                    ]}
                                />
                            </Field>
                        </Form>
                    </section>
                </div>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Checkboxes</span>
                        <Form>
                            <div className={classes.checkboxList}>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkbox" field="checkbox" />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkbox selected" field="checkbox-active" initialValue={true} />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox
                                        label="Circle Checkbox selected"
                                        field="checkbox-circle"
                                        initialValue={true}
                                        isCircle={true}
                                    />
                                </div>
                            </div>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Radio Buttons</span>
                        <Form>
                            <RadioGroup
                                field="radio"
                                id={'radio'}
                                initialValue="r2"
                                items={[
                                    {
                                        key: 'r1',
                                        value: 'r1',
                                        label: 'Radio button'
                                    },
                                    {
                                        key: 'r2',
                                        value: 'r2',
                                        label: 'Radio button selected'
                                    }
                                ]}
                            />
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Qty Field</span>
                        <QuantityFields />
                    </section>
                </div>
            </div>
            <section className={classes.section}>
                <span className={classes.subtitle}>Newsletter Input</span>
                <Newsletter classes={{ title: classes.newsletterTitle, newsletter_text: classes.newsletterText }} />
            </section>
        </div>
    );
};

export default InputSection;
