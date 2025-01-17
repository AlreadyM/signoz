/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './DataSource.styles.scss';

import { Card, Form, Input, Select, Typography } from 'antd';
import cx from 'classnames';
import { useOnboardingContext } from 'container/OnboardingContainer/context/OnboardingContext';
import { useCases } from 'container/OnboardingContainer/OnboardingContainer';
import {
	getDataSources,
	getSupportedFrameworks,
	hasFrameworks,
} from 'container/OnboardingContainer/utils/dataSourceUtils';
import { useEffect, useState } from 'react';
import { popupContainer } from 'utils/selectPopupContainer';

export interface DataSourceType {
	id?: string;
	name: string;
	imgURL?: string;
	label?: string;
}

export default function DataSource(): JSX.Element {
	const [form] = Form.useForm();

	const {
		serviceName,
		selectedModule,
		selectedDataSource,
		selectedFramework,
		updateSelectedDataSource,
		updateServiceName,
		updateSelectedFramework,
	} = useOnboardingContext();

	const [supportedDataSources, setSupportedDataSources] = useState<
		DataSourceType[]
	>([]);
	const [supportedframeworks, setSupportedframeworks] = useState<
		DataSourceType[]
	>([]);

	const [enableFrameworks, setEnableFrameworks] = useState(false);

	useEffect(() => {
		if (selectedModule) {
			const dataSource = getDataSources(selectedModule);

			setSupportedDataSources(dataSource);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedModule && selectedDataSource) {
			const frameworks = hasFrameworks({
				module: selectedModule,
				dataSource: selectedDataSource,
			});

			if (frameworks) {
				setEnableFrameworks(true);
				setSupportedframeworks(
					getSupportedFrameworks({
						module: selectedModule,
						dataSource: selectedDataSource,
					}),
				);
			} else {
				setEnableFrameworks(false);
			}
		}
	}, [selectedModule, selectedDataSource]);

	return (
		<div className="module-container">
			<Typography.Text className="data-source-title">
				<span className="required-symbol">*</span> Select Data Source
			</Typography.Text>

			<div className="supported-languages-container">
				{supportedDataSources?.map((dataSource) => (
					<Card
						className={cx(
							'supported-language',
							selectedDataSource?.name === dataSource.name ? 'selected' : '',
						)}
						key={dataSource.name}
						onClick={(): void => {
							updateSelectedFramework(null);
							updateSelectedDataSource(dataSource);
							form.setFieldsValue({ selectFramework: null });
						}}
					>
						<div>
							<img
								className={cx('supported-langauge-img')}
								src={dataSource.imgURL}
								alt=""
							/>
						</div>

						<div>
							<Typography.Text className="serviceName">
								{dataSource.name}
							</Typography.Text>
						</div>
					</Card>
				))}
			</div>

			{selectedModule?.id === useCases.APM.id && (
				<div className="form-container">
					<div className="service-name-container">
						<Form
							initialValues={{
								serviceName,
								selectFramework: selectedFramework,
							}}
							form={form}
							onValuesChange={(): void => {
								const serviceName = form.getFieldValue('serviceName');

								updateServiceName(serviceName);
							}}
							name="data-source-form"
							style={{ minWidth: '300px' }}
							layout="vertical"
							validateTrigger="onBlur"
						>
							<Form.Item
								name="serviceName"
								label="Service Name"
								rules={[{ required: true, message: 'Please enter service name' }]}
								validateTrigger="onBlur"
							>
								<Input autoFocus />
							</Form.Item>

							{enableFrameworks && (
								<div className="framework-selector">
									<Form.Item
										label="Select Framework"
										name="selectFramework"
										rules={[{ required: true, message: 'Please select framework' }]}
									>
										<Select
											value={selectedFramework}
											getPopupContainer={popupContainer}
											style={{ minWidth: 120 }}
											placeholder="Select Framework"
											onChange={(value): void => updateSelectedFramework(value)}
											options={supportedframeworks}
										/>
									</Form.Item>
								</div>
							)}
						</Form>
					</div>
				</div>
			)}
		</div>
	);
}
