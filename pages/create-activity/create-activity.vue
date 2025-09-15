<template>
	<view class="container">
		<!-- Smart Navigation -->
		<view class="smart-nav">
			<view class="nav-container">
				<view
					class="nav-item"
					:class="{'nav-item-active': currentStep >= 1}"
					@click="navigateToStep(1)">
					<view class="nav-number">1</view>
					<text class="nav-text">基本信息</text>
				</view>
				<view class="nav-line"></view>
				<view
					class="nav-item"
					:class="{'nav-item-active': currentStep >= 2}"
					@click="navigateToStep(2)">
					<view class="nav-number">2</view>
					<text class="nav-text">详细信息</text>
				</view>
				<view class="nav-line"></view>
				<view
					class="nav-item"
					:class="{'nav-item-active': currentStep >= 3}"
					@click="navigateToStep(3)">
					<view class="nav-number">3</view>
					<text class="nav-text">报名设置</text>
				</view>
				<view class="nav-line"></view>
				<view
					class="nav-item"
					:class="{'nav-item-active': currentStep >= 4}"
					@click="navigateToStep(4)">
					<view class="nav-number">4</view>
					<text class="nav-text">发布设置</text>
				</view>
			</view>
			<view class="progress-bar">
				<view class="progress-fill" :style="{width: progressWidth + '%'}"></view>
			</view>
		</view>

		<!-- Form Content -->
		<scroll-view
			class="form-content"
			scroll-y
			:scroll-top="scrollTop"
			@scroll="handleScroll"
			@tap="handlePageTap">

			<!-- Basic Information Section -->
			<view id="step-1" class="form-section">
				<!-- History Activity Selector -->
				<view class="form-group">
					<text class="form-label">快速填充（可选）</text>
					<view class="history-selector" @tap.stop>
						<view class="selector-container" @tap="toggleHistoryDropdown">
							<view class="selector-content">
								<text class="selector-icon">📚</text>
								<text class="selector-text" v-if="selectedHistoryActivity">
									{{selectedHistoryActivity.name}}
								</text>
								<text class="selector-text placeholder" v-else>
									选择历史活动快速填充
								</text>
							</view>
							<view class="selector-arrow" :class="{'arrow-up': showHistoryDropdown}">
								<text class="arrow-icon">▼</text>
							</view>
						</view>

						<!-- Dropdown Menu -->
						<view class="history-dropdown" v-if="showHistoryDropdown" @tap.stop>
							<view class="dropdown-header">
								<text class="dropdown-title">历史活动列表</text>
								<text class="dropdown-count">共 {{historyData.length}} 条</text>
							</view>
							<view class="dropdown-search" @tap.stop>
								<text class="search-icon">🔍</text>
								<input
									class="history-search-input"
									v-model="historySearchKeyword"
									placeholder="搜索活动名称..."
									@input="filterHistoryActivities" />
							</view>
							<scroll-view class="dropdown-list" scroll-y v-if="filteredHistoryActivities.length > 0">
								<view
									class="dropdown-item"
									v-for="activity in filteredHistoryActivities"
									:key="activity.id"
									@tap="selectHistoryActivity(activity)">
									<view class="item-content">
										<view class="item-name">{{activity.name}}</view>
										<view class="item-desc">{{activity.shortDesc}}</view>
										<view class="item-location">
											<text class="location-icon">📍</text>
											<text>{{activity.province}} {{activity.city}}</text>
										</view>
									</view>
									<view class="item-arrow">
										<text class="arrow-icon">→</text>
									</view>
								</view>
							</scroll-view>
							<view class="dropdown-empty" v-else>
								<text class="empty-icon">📋</text>
								<text class="empty-text">暂无匹配的历史活动</text>
							</view>
						</view>
					</view>
				</view>

				<view class="section-header">
					<view class="section-icon">📋</view>
					<text class="section-title">基本信息</text>
				</view>

				<!-- Activity Image Upload -->
				<view class="form-group">
					<text class="form-label">活动头图</text>
					<view class="upload-area" @click="uploadImage">
						<view class="upload-icon">📷</view>
						<text class="upload-text">点击上传活动头图</text>
						<text class="upload-hint">建议尺寸：4:3比例</text>
						<image v-if="formData.image" :src="formData.image" class="uploaded-image" mode="aspectFill"></image>
					</view>
				</view>

				<!-- Activity Name -->
				<view class="form-group">
					<form-input
						v-model="formData.name"
						label="活动名称"
						:required="true"
						placeholder="请输入活动名称"
						:error="errors.name"
						@blur="validateField('name')" />
				</view>

				<!-- Activity Description -->
				<view class="form-group">
					<form-textarea
						v-model="formData.shortDesc"
						label="一句话简介"
						:required="true"
						placeholder="用一句话描述您的活动（20字以内）"
						:maxlength="20"
						:error="errors.shortDesc"
						char-count-position="outside"
						rows="2"
						@blur="validateField('shortDesc')" />
				</view>

				<!-- Activity Time -->
				<view class="form-group">
					<text class="form-label required">活动时间 *</text>
					<view class="time-grid">
						<view class="time-input-group">
							<picker
								mode="date"
								:value="formData.startTime"
								@change="onStartTimeChange">
								<view class="picker-input">
									<text v-if="formData.startTime">{{formData.startTime}}</text>
									<text v-else class="placeholder">选择开始日期</text>
								</view>
							</picker>
							<text class="input-label">开始时间</text>
						</view>
						<view class="time-input-group">
							<picker
								mode="date"
								:value="formData.endTime"
								@change="onEndTimeChange">
								<view class="picker-input">
									<text v-if="formData.endTime">{{formData.endTime}}</text>
									<text v-else class="placeholder">选择结束日期</text>
								</view>
							</picker>
							<text class="input-label">结束时间</text>
						</view>
					</view>
				</view>

				<!-- Activity Location -->
				<view class="form-group">
					<text class="form-label required">活动地点 *</text>
					<view class="location-grid">
						<picker
							mode="selector"
							:range="provinces"
							:value="locationIndex.province"
							@change="onProvinceChange">
							<view class="picker-input">
								{{provinces[locationIndex.province] || '选择省份'}}
							</view>
						</picker>
						<picker
							mode="selector"
							:range="cities"
							:value="locationIndex.city"
							@change="onCityChange">
							<view class="picker-input">
								{{cities[locationIndex.city] || '选择城市'}}
							</view>
						</picker>
						<picker
							mode="selector"
							:range="districts"
							:value="locationIndex.district"
							@change="onDistrictChange">
							<view class="picker-input">
								{{districts[locationIndex.district] || '选择区县'}}
							</view>
						</picker>
					</view>
					<view class="address-input-group">
						<form-input
							v-model="formData.address"
							placeholder="请输入详细地址"
							:error="errors.address"
							@blur="validateField('address')" />
						<button class="copy-btn" @click="copyAddress">
							<text class="copy-icon">📋</text>
						</button>
					</view>
				</view>

				<!-- Max Participants and Fee -->
				<view class="form-row">
					<view class="form-group half">
						<form-input
							v-model="formData.maxParticipants"
							label="最大人数"
							type="number"
							placeholder="不限制请留空"
							min="1" />
					</view>
					<view class="form-group half">
						<form-input
							v-model="formData.fee"
							label="活动费用"
							type="digit"
							placeholder="0.00"
							prefix="¥"
							min="0"
							step="0.01" />
					</view>
				</view>

				<!-- Activity Tags -->
				<view class="form-group">
					<text class="form-label">活动标签</text>
					<view class="tags-container">
						<view
							v-for="tag in activityTags"
							:key="tag.id"
							class="tag-pill"
							:class="{'tag-selected': formData.tags.includes(tag.id)}"
							@click="toggleTag(tag.id)">
							<text class="tag-emoji">{{tag.icon}}</text>
							<text class="tag-text">{{tag.name}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Detailed Information Section -->
			<view id="step-2" class="form-section">
				<view class="section-header">
					<view class="section-icon">📄</view>
					<text class="section-title">详细信息</text>
				</view>

				<!-- Activity Details -->
				<view class="form-group">
					<form-textarea
						v-model="formData.details"
						label="活动详情"
						placeholder="请输入活动详细描述..."
						:maxlength="1500"
						rows="6"
						char-count-position="outside"
						auto-height />
				</view>

				<!-- Warm Tips -->
				<view class="form-group">
					<view class="collapsible-header" @click="toggleSection('tips')">
						<text class="form-label">温馨提示/身体限制</text>
						<view class="collapse-icon" :class="{'collapsed': !sections.tips}">
							<text class="arrow-icon">▼</text>
						</view>
					</view>
					<view v-if="sections.tips" class="collapsible-content">
						<form-textarea
							v-model="formData.tips"
							placeholder="例如：场馆禁止携带打火机、高血压患者谨慎参与等"
							rows="3"
							size="small" />
					</view>
				</view>

				<!-- Contact Information -->
				<view class="form-group">
					<form-input
						v-model="formData.contact"
						label="联系方式"
						type="tel"
						placeholder="请输入活动负责人联系电话" />
				</view>
			</view>

			<!-- Registration Form Settings Section -->
			<view id="step-3" class="form-section">
				<view class="section-header">
					<view class="section-icon">📝</view>
					<text class="section-title">报名表单设置</text>
				</view>

				<!-- Registration Type Settings -->
				<view class="form-group">
					<text class="subsection-title">报名类型设置</text>
					<view class="checkbox-group">
						<label class="checkbox-item">
							<checkbox
								:checked="formData.registration.allowIndividual"
								@tap="toggleRegistrationType('individual')" />
							<view class="checkbox-content">
								<text class="checkbox-label">允许个人报名</text>
								<text class="checkbox-desc">用户可以个人身份报名参加活动</text>
							</view>
						</label>

						<label class="checkbox-item">
							<checkbox
								:checked="formData.registration.allowTeam"
								@tap="toggleRegistrationType('team')" />
							<view class="checkbox-content">
								<text class="checkbox-label">允许团队报名</text>
								<text class="checkbox-desc">用户可以团队身份报名参加活动</text>
							</view>
						</label>

						<label class="checkbox-item">
							<checkbox
								:checked="formData.registration.requireApproval"
								@tap="toggleRegistrationType('approval')" />
							<view class="checkbox-content">
								<text class="checkbox-label">需要审核报名</text>
								<text class="checkbox-desc">用户报名后需要您手动审核通过</text>
							</view>
						</label>
					</view>
				</view>

				<!-- Personal Registration Fields -->
				<view class="form-group">
					<view class="fields-header">
						<text class="subsection-title">个人报名字段设置</text>
						<text class="select-all-btn" @click="toggleAllPersonalFields()">全选/取消全选</text>
					</view>
					<view class="fields-grid">
						<label v-for="field in personalFields" :key="field.id" class="field-item">
							<checkbox
								:checked="formData.registration.personalFields.includes(field.id)"
								:disabled="field.required"
								@tap="togglePersonalField(field.id)" />
							<text class="field-label">{{field.label}}</text>
							<text :class="field.required ? 'text-required' : 'text-optional'">
								{{field.required ? '必填' : '选填'}}
							</text>
						</label>
					</view>
				</view>

				<!-- Team Registration Fields -->
				<view class="form-group">
					<view class="fields-header">
						<text class="subsection-title">团队报名字段设置</text>
						<text class="select-all-btn" @click="toggleAllTeamFields()">全选/取消全选</text>
					</view>
					<view class="fields-grid">
						<label v-for="field in teamFields" :key="field.id" class="field-item">
							<checkbox
								:checked="formData.registration.teamFields.includes(field.id)"
								:disabled="field.required"
								@tap="toggleTeamField(field.id)" />
							<text class="field-label">{{field.label}}</text>
							<text :class="field.required ? 'text-required' : 'text-optional'">
								{{field.required ? '必填' : '选填'}}
							</text>
						</label>
					</view>
				</view>

				<!-- Custom Fields -->
				<view class="form-group">
					<view class="fields-header">
						<text class="subsection-title">自定义标签</text>
						<text class="add-btn" @click="addCustomField()">
							<text class="add-icon">+</text>添加自定义字段
						</text>
					</view>
					<view class="custom-fields-container">
						<view
							v-for="(field, index) in formData.registration.customFields"
							:key="field.id"
							class="custom-field-item">
							<view class="custom-field-header">
								<form-input
									v-model="field.name"
									placeholder="自定义字段名称"
									size="small" />
								<view class="custom-field-actions">
									<label class="required-toggle">
										<checkbox :checked="field.required" @tap="toggleCustomFieldRequired(index)" />
										<text class="toggle-text">必填</text>
									</label>
									<text class="remove-btn" @click="removeCustomField(index)">✕</text>
								</view>
							</view>
							<form-input
								v-model="field.description"
								placeholder="字段描述（选填）"
								size="small" />
						</view>
					</view>
				</view>
			</view>

			<!-- Publishing Settings Section -->
			<view id="step-4" class="form-section">
				<view class="section-header">
					<view class="section-icon">⚙️</view>
					<text class="section-title">发布设置</text>
				</view>

				<!-- Customer Service Call -->
				<view class="form-group">
					<view class="toggle-item">
						<view class="toggle-content">
							<text class="toggle-label">客服呼叫</text>
							<text class="toggle-desc">开启后用户可一键呼叫您</text>
						</view>
						<switch
							:checked="formData.settings.customerService"
							@change="onCustomerServiceChange" />
					</view>
				</view>

				<!-- Custom Form Modules -->
				<view class="form-group">
					<view class="fields-header">
						<text class="subsection-title">自定义报名表单</text>
						<text class="add-btn" @click="addCustomModule()">
							<text class="add-icon">+</text>添加模块
						</text>
					</view>
					<view class="custom-modules-container">
						<view
							v-for="(module, index) in formData.settings.customModules"
							:key="module.id"
							class="custom-module-item">
							<view class="custom-module-header">
								<form-input
									v-model="module.title"
									placeholder="问题标题"
									size="small" />
								<text class="remove-btn" @click="removeCustomModule(index)">✕</text>
							</view>
							<picker
								mode="selector"
								:range="moduleTypes"
								:value="moduleTypes.indexOf(module.type)"
								@change="onModuleTypeChange($event, index)">
								<view class="module-type-picker">
									{{module.type || '选择字段类型'}}
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		 <!-- Bottom Action Bar -->
		<view class="bottom-bar">
			<view class="action-buttons">
				<button class="btn-secondary" @click="saveDraft">
					<text class="btn-text">保存草稿</text>
				</button>
				<button class="btn-primary" @click="submitForReview">
					<text class="btn-text">提交审核</text>
				</button>
			</view>
		</view>

		<!-- Activity History Modal - Shadcn Style -->
		<view class="history-modal" v-if="showModal">
			<view class="modal-overlay" @click="closeHistoryModal"></view>
			<view class="modal-content">
				<!-- Modal Header -->
				<view class="modal-header">
					<view class="header-content">
						<view class="header-title">
							<text class="title-icon">📚</text>
							<text class="title-text">活动发布历史</text>
						</view>
						<view class="header-subtitle">
							<text class="subtitle-text">快速查找并填充历史活动数据</text>
						</view>
					</view>
					<view class="close-btn" @click="closeHistoryModal">
						<text class="close-icon">✕</text>
					</view>
				</view>

				<!-- Search Section -->
				<view class="search-section">
					<view class="search-container">
						<text class="search-icon">🔍</text>
						<input
							class="search-input"
							v-model="searchKeyword"
							placeholder="搜索活动名称、地点、描述..."
							@input="onSearchInput"
							@focus="onSearchFocus"
							@blur="onSearchBlur" />
					</view>
				</view>

				<!-- Modal Body -->
				<scroll-view class="modal-body" scroll-y>
					<!-- Empty State -->
					<view v-if="filteredHistory.length === 0" class="empty-state">
						<view class="empty-icon-container">
							<text class="empty-icon">📝</text>
						</view>
						<text class="empty-title">暂无活动发布记录</text>
						<text class="empty-description">发布活动后将自动保存到历史记录中</text>
					</view>

					<!-- History Items -->
					<view v-else class="history-list">
						<view
							v-for="(item, index) in filteredHistory"
							:key="index"
							class="history-card"
							@click="fillFromHistory(item)">

							<!-- Card Header -->
							<view class="card-header">
								<view class="card-title-area">
									<text class="card-title">{{item.name || '未命名活动'}}</text>
									<text class="card-subtitle">{{item.shortDesc || '暂无描述'}}</text>
								</view>
								<view class="card-badge">
									<text class="badge-text">{{item.publishDate || '刚刚'}}</text>
								</view>
							</view>

							<!-- Card Content -->
							<view class="card-content">
								<view class="info-row">
									<view class="info-item">
										<text class="info-icon">📍</text>
										<text class="info-text">{{item.province}}{{item.city}}{{item.district || '地点未知'}}</text>
									</view>
									<view class="info-item">
										<text class="info-icon">📅</text>
										<text class="info-text">{{item.startTime || '时间未知'}}</text>
									</view>
								</view>
								<view v-if="item.maxParticipants || item.fee" class="info-row">
									<view class="info-item" v-if="item.maxParticipants">
										<text class="info-icon">👥</text>
										<text class="info-text">{{item.maxParticipants}}人</text>
									</view>
									<view class="info-item" v-if="item.fee">
										<text class="info-icon">💰</text>
										<text class="info-text">¥{{item.fee}}</text>
									</view>
								</view>
							</view>

							<!-- Card Footer -->
							<view class="card-footer">
								<view class="action-button">
									<text class="action-icon">📝</text>
									<text class="action-text">填充表单</text>
								</view>
								<view class="card-arrow">→</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import FormInput from '@/components/form-input.vue'
import FormTextarea from '@/components/form-textarea.vue'
import { activityService } from '@/services/activity'

export default {
	components: {
		FormInput,
		FormTextarea
	},

	data() {
		return {
			currentStep: 1,
			scrollTop: 0,
			progressWidth: 25,

			// Modal state
			showModal: false,
			searchKeyword: '',
			historyData: [],
			filteredHistory: [],

			// History selector state
			showHistoryDropdown: false,
			historySearchKeyword: '',
			selectedHistoryActivity: null,
			filteredHistoryActivities: [],

			// Form data
			formData: {
				image: '',
				name: '',
				shortDesc: '',
				startTime: '',
				endTime: '',
				province: '',
				city: '',
				district: '',
				address: '',
				maxParticipants: '',
				fee: '',
				tags: [],
				details: '',
				tips: '',
				contact: '',
				registration: {
					allowIndividual: true,
					allowTeam: true,
					requireApproval: false,
					personalFields: ['name', 'phone'],
					teamFields: ['teamName', 'leaderName', 'leaderPhone', 'programName', 'programType', 'participantCount'],
					customFields: []
				},
				settings: {
					customerService: false,
					customModules: []
				}
			},

	
			// Validation errors
			errors: {},

			// Section toggles
			sections: {
				tips: false
			},

			// Location data structure
			locationData: {
				'北京市': {
					'北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
				},
				'上海市': {
					'上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
				},
				'天津市': {
					'天津市': ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区']
				},
				'重庆市': {
					'重庆市': ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区']
				},
				'广东省': {
					'广州市': ['越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
					'深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
					'珠海市': ['香洲区', '斗门区', '金湾区'],
					'汕头市': ['龙湖区', '金平区', '濠江区', '潮阳区', '潮南区', '澄海区', '南澳县'],
					'佛山市': ['禅城区', '南海区', '顺德区', '三水区', '高明区'],
					'韶关市': ['浈江区', '武江区', '曲江区', '始兴县', '仁化县', '翁源县', '新丰县', '乳源瑶族自治县', '乐昌市', '南雄市'],
					'湛江市': ['赤坎区', '霞山区', '坡头区', '麻章区', '遂溪县', '徐闻县', '廉江市', '雷州市', '吴川市'],
					'肇庆市': ['端州区', '鼎湖区', '高要区', '广宁县', '怀集县', '封开县', '德庆县', '四会市'],
					'江门市': ['蓬江区', '江海区', '新会区', '台山市', '开平市', '鹤山市', '恩平市'],
					'茂名市': ['茂南区', '电白区', '高州市', '化州市', '信宜市'],
					'惠州市': ['惠城区', '惠阳区', '博罗县', '惠东县', '龙门县'],
					'梅州市': ['梅江区', '梅县区', '大埔县', '丰顺县', '五华县', '平远县', '蕉岭县', '兴宁市'],
					'汕尾市': ['城区', '海丰县', '陆河县', '陆丰市'],
					'河源市': ['源城区', '紫金县', '龙川县', '连平县', '和平县', '东源县'],
					'阳江市': ['江城区', '阳东区', '阳西县', '阳春市'],
					'清远市': ['清城区', '清新区', '佛冈县', '阳山县', '连山壮族瑶族自治县', '连南瑶族自治县', '英德市', '连州市'],
					'东莞市': ['东莞市'],
					'中山市': ['中山市'],
					'潮州市': ['湘桥区', '潮安区', '饶平县'],
					'揭阳市': ['榕城区', '揭东区', '揭西县', '惠来县', '普宁市'],
					'云浮市': ['云城区', '云安区', '新兴县', '郁南县', '罗定市']
				},
				'浙江省': {
					'杭州市': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
					'宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市'],
					'温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市', '龙港市'],
					'嘉兴市': ['南湖区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市'],
					'湖州市': ['吴兴区', '南浔区', '德清县', '长兴县', '安吉县'],
					'绍兴市': ['越城区', '柯桥区', '上虞区', '新昌县', '诸暨市', '嵊州市'],
					'金华市': ['婺城区', '金东区', '武义县', '浦江县', '磐安县', '兰溪市', '义乌市', '东阳市', '永康市'],
					'衢州市': ['柯城区', '衢江区', '常山县', '开化县', '龙游市', '江山市'],
					'舟山市': ['定海区', '普陀区', '岱山县', '嵊泗县'],
					'台州市': ['椒江区', '黄岩区', '路桥区', '三门县', '天台县', '仙居县', '温岭市', '临海市', '玉环市'],
					'丽水市': ['莲都区', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县', '龙泉市']
				},
				'江苏省': {
					'南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
					'无锡市': ['锡山区', '惠山区', '滨湖区', '梁溪区', '新吴区', '江阴市', '宜兴市'],
					'徐州市': ['鼓楼区', '云龙区', '贾汪区', '泉山区', '铜山区', '丰县', '沛县', '睢宁县', '新沂市', '邳州市'],
					'常州市': ['天宁区', '钟楼区', '新北区', '武进区', '金坛区', '溧阳市'],
					'苏州市': ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市'],
					'南通市': ['崇川区', '港闸区', '通州区', '如东县', '启东市', '如皋市', '海门市'],
					'连云港市': ['连云区', '海州区', '赣榆区', '东海县', '灌云县', '灌南县'],
					'淮安市': ['淮安区', '淮阴区', '清江浦区', '洪泽区', '涟水县', '盱眙县', '金湖县'],
					'盐城市': ['亭湖区', '盐都区', '大丰区', '响水县', '滨海县', '阜宁县', '射阳县', '建湖县', '东台市'],
					'扬州市': ['邗江区', '广陵区', '江都区', '宝应县', '仪征市', '高邮市'],
					'镇江市': ['京口区', '润州区', '丹徒区', '丹阳市', '扬中市', '句容市'],
					'泰州市': ['海陵区', '高港区', '姜堰区', '兴化市', '靖江市', '泰兴市'],
					'宿迁市': ['宿城区', '宿豫区', '沭阳县', '泗阳县', '泗洪县']
				},
				'山东省': {
					'济南市': ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '章丘区', '济阳区', '莱芜区', '钢城区', '平阴县', '商河县'],
					'青岛市': ['市南区', '市北区', '李沧区', '城阳区', '崂山区', '黄岛区', '即墨区', '胶州市', '平度市', '莱西市'],
					'淄博市': ['淄川区', '张店区', '博山区', '临淄区', '周村区', '桓台县', '高青县', '沂源县'],
					'枣庄市': ['市中区', '薛城区', '峄城区', '台儿庄区', '山亭区', '滕州市'],
					'东营市': ['东营区', '河口区', '垦利区', '利津县', '广饶县'],
					'烟台市': ['芝罘区', '福山区', '牟平区', '莱山区', '蓬莱区', '龙口市', '莱阳市', '莱州市', '招远市', '栖霞市', '海阳市'],
					'潍坊市': ['潍城区', '寒亭区', '坊子区', '奎文区', '临朐县', '昌乐县', '青州市', '诸城市', '寿光市', '安丘市', '高密市', '昌邑市'],
					'济宁市': ['任城区', '兖州区', '微山县', '鱼台县', '金乡县', '嘉祥县', '汶上县', '泗水县', '梁山县', '曲阜市', '邹城市'],
					'泰安市': ['泰山区', '岱岳区', '宁阳县', '东平县', '新泰市', '肥城市'],
					'威海市': ['环翠区', '文登区', '荣成市', '乳山市'],
					'日照市': ['东港区', '岚山区', '五莲县', '莒县'],
					'临沂市': ['兰山区', '罗庄区', '河东区', '沂南县', '郯城县', '兰陵县', '莒南县', '蒙阴县', '平邑县', '费县', '沂水县', '临沭县'],
					'德州市': ['德城区', '陵城区', '宁津县', '庆云县', '临邑县', '齐河县', '平原县', '夏津县', '武城县', '乐陵市', '禹城市'],
					'聊城市': ['东昌府区', '茌平区', '阳谷县', '莘县', '东阿县', '冠县', '高唐县', '临清市'],
					'滨州市': ['滨城区', '沾化区', '惠民县', '阳信县', '无棣县', '博兴县', '邹平市'],
					'菏泽市': ['牡丹区', '定陶区', '曹县', '单县', '成武县', '巨野县', '郓城县', '鄄城县', '东明县']
				},
				'河南省': {
					'郑州市': ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市'],
					'开封市': ['龙亭区', '顺河回族区', '鼓楼区', '禹王台区', '祥符区', '杞县', '通许县', '尉氏县', '兰考县'],
					'洛阳市': ['老城区', '西工区', '瀍河回族区', '涧西区', '吉利区', '洛龙区', '孟津区', '偃师区', '新安县', '栾川县', '嵩县', '汝阳县', '宜阳县', '洛宁县', '伊川县'],
					'平顶山市': ['新华区', '卫东区', '石龙区', '湛河区', '宝丰县', '叶县', '鲁山县', '郏县', '舞钢市', '汝州市'],
					'安阳市': ['文峰区', '北关区', '殷都区', '龙安区', '安阳县', '汤阴县', '滑县', '内黄县', '林州市'],
					'鹤壁市': ['鹤山区', '山城区', '淇滨区', '浚县', '淇县'],
					'新乡市': ['红旗区', '卫滨区', '凤泉区', '牧野区', '新乡县', '获嘉县', '原阳县', '延津县', '封丘县', '长垣市', '卫辉市', '辉县市'],
					'焦作市': ['解放区', '中站区', '马村区', '山阳区', '修武县', '博爱县', '武陟县', '温县', '沁阳市', '孟州市'],
					'濮阳市': ['华龙区', '濮阳县', '清丰县', '南乐县', '范县', '台前县'],
					'许昌市': ['魏都区', '建安区', '鄢陵县', '襄城县', '禹州市', '长葛市'],
					'漯河市': ['源汇区', '郾城区', '召陵区', '舞阳县', '临颍县'],
					'三门峡市': ['湖滨区', '陕州区', '渑池县', '卢氏县', '义马市', '灵宝市'],
					'南阳市': ['宛城区', '卧龙区', '南召县', '方城县', '西峡县', '镇平县', '内乡县', '淅川县', '社旗县', '唐河县', '新野县', '桐柏县', '邓州市'],
					'商丘市': ['梁园区', '睢阳区', '民权县', '睢县', '宁陵县', '柘城县', '虞城县', '夏邑县', '永城市'],
					'信阳市': ['浉河区', '平桥区', '罗山县', '光山县', '新县', '商城县', '固始县', '潢川县', '淮滨县', '息县'],
					'周口市': ['川汇区', '淮阳区', '扶沟县', '西华县', '商水县', '沈丘县', '郸城县', '太康县', '鹿邑县', '项城市'],
					'驻马店市': ['驿城区', '西平县', '上蔡县', '平舆县', '正阳县', '确山县', '泌阳县', '汝南县', '遂平县', '新蔡县']
				},
				'四川省': {
					'成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '新津区', '金堂县', '大邑县', '蒲江县', '都江堰市', '彭州市', '邛崃市', '崇州市', '简阳市'],
					'自贡市': ['自流井区', '贡井区', '大安区', '沿滩区', '荣县', '富顺县'],
					'攀枝花市': ['东区', '西区', '仁和区', '米易县', '盐边县'],
					'泸州市': ['江阳区', '纳溪区', '龙马潭区', '泸县', '合江县', '叙永县', '古蔺县'],
					'德阳市': ['旌阳区', '旌阳区', '罗江区', '中江县', '广汉市', '什邡市', '绵竹市'],
					'绵阳市': ['涪城区', '游仙区', '安州区', '三台县', '盐亭县', '梓潼县', '北川羌族自治县', '平武县', '江油市'],
					'广元市': ['利州区', '昭化区', '朝天区', '旺苍县', '青川县', '剑阁县', '苍溪县'],
					'遂宁市': ['船山区', '安居区', '蓬溪县', '大英县', '射洪市'],
					'内江市': ['市中区', '东兴区', '威远县', '资中县', '隆昌市'],
					'乐山市': ['市中区', '沙湾区', '五通桥区', '金口河区', '犍为县', '井研县', '夹江县', '沐川县', '峨边彝族自治县', '马边彝族自治县', '峨眉山市'],
					'南充市': ['顺庆区', '高坪区', '嘉陵区', '南部县', '营山县', '蓬安县', '仪陇县', '西充县', '阆中市'],
					'眉山市': ['东坡区', '彭山区', '仁寿县', '彭山县', '洪雅县', '丹棱县', '青神县'],
					'宜宾市': ['翠屏区', '南溪区', '叙州区', '江安县', '长宁县', '高县', '珙县', '筠连县', '兴文县', '屏山县'],
					'广安市': ['广安区', '前锋区', '岳池县', '武胜县', '邻水县', '华蓥市'],
					'达州市': ['通川区', '达川区', '宣汉县', '开江县', '大竹县', '渠县', '万源市'],
					'雅安市': ['雨城区', '名山区', '荥经县', '汉源县', '石棉县', '天全县', '芦山县', '宝兴县'],
					'巴中市': ['巴州区', '恩阳区', '通江县', '南江县', '平昌县'],
					'资阳市': ['雁江区', '安岳县', '乐至县'],
					'阿坝藏族羌族自治州': ['马尔康市', '汶川县', '理县', '茂县', '松潘县', '九寨沟县', '金川县', '小金县', '黑水县', '壤塘县', '阿坝县', '若尔盖县', '红原县'],
					'甘孜藏族自治州': ['康定市', '泸定县', '丹巴县', '九龙县', '雅江县', '道孚县', '炉霍县', '甘孜县', '新龙县', '德格县', '白玉县', '石渠县', '色达县', '理塘县', '巴塘县', '乡城县', '稻城县', '得荣县'],
					'凉山彝族自治州': ['西昌市', '木里藏族自治县', '盐源县', '德昌县', '会理县', '会东县', '宁南县', '普格县', '布拖县', '金阳县', '昭觉县', '喜德县', '冕宁县', '越西县', '甘洛县', '美姑县', '雷波县']
				},
				'湖北省': {
					'武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'],
					'黄石市': ['黄石港区', '西塞山区', '下陆区', '铁山区', '阳新县', '大冶市'],
					'十堰市': ['茅箭区', '张湾区', '郧阳区', '郧西县', '竹山县', '竹溪县', '房县', '丹江口市'],
					'宜昌市': ['西陵区', '伍家岗区', '点军区', '猇亭区', '夷陵区', '远安县', '兴山县', '秭归县', '长阳土家族自治县', '五峰土家族自治县', '宜都市', '当阳市', '枝江市'],
					'襄阳市': ['襄城区', '樊城区', '襄州区', '南漳县', '谷城县', '保康县', '老河口市', '枣阳市', '宜城市'],
					'鄂州市': ['梁子湖区', '华容区', '鄂城区'],
					'荆门市': ['东宝区', '掇刀区', '京山县', '沙洋县', '钟祥市'],
					'孝感市': ['孝南区', '孝昌县', '大悟县', '云梦县', '应城市', '安陆市', '汉川市'],
					'荆州市': ['沙市区', '荆州区', '公安县', '监利市', '江陵县', '石首市', '洪湖市', '松滋市'],
					'黄冈市': ['黄州区', '团风县', '红安县', '罗田县', '英山县', '浠水县', '蕲春县', '黄梅县', '麻城市', '武穴市'],
					'咸宁市': ['咸安区', '嘉鱼县', '通城县', '崇阳县', '通山县', '赤壁市'],
					'随州市': ['曾都区', '随县', '广水市'],
					'恩施土家族苗族自治州': ['恩施市', '利川市', '建始县', '巴东县', '宣恩县', '咸丰县', '来凤县', '鹤峰县']
				},
				'湖南省': {
					'长沙市': ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区', '长沙县', '浏阳市', '宁乡市'],
					'株洲市': ['荷塘区', '芦淞区', '石峰区', '天元区', '渌口区', '攸县', '茶陵县', '炎陵县', '醴陵市'],
					'湘潭市': ['雨湖区', '岳塘区', '湘潭县', '湘乡市', '韶山市'],
					'衡阳市': ['珠晖区', '雁峰区', '石鼓区', '蒸湘区', '南岳区', '衡阳县', '衡南县', '衡山县', '衡东县', '祁东县', '耒阳市', '常宁市'],
					'邵阳市': ['双清区', '大祥区', '北塔区', '新邵县', '邵阳县', '隆回县', '洞口县', '绥宁县', '新宁县', '城步苗族自治县', '武冈市', '邵东市'],
					'岳阳市': ['岳阳楼区', '云溪区', '君山区', '岳阳县', '华容县', '湘阴县', '平江县', '汨罗市', '临湘市'],
					'常德市': ['武陵区', '鼎城区', '安乡县', '汉寿县', '澧县', '临澧县', '桃源县', '石门县', '津市市'],
					'张家界市': ['永定区', '武陵源区', '慈利县', '桑植县'],
					'益阳市': ['资阳区', '赫山区', '南县', '桃江县', '安化县', '沅江市'],
					'郴州市': ['北湖区', '苏仙区', '桂阳县', '宜章县', '永兴县', '嘉禾县', '临武县', '汝城县', '桂东县', '安仁县', '资兴市'],
					'永州市': ['零陵区', '冷水滩区', '祁阳县', '东安县', '双牌县', '道县', '江永县', '宁远县', '蓝山县', '新田县', '江华瑶族自治县'],
					'怀化市': ['鹤城区', '中方县', '沅陵县', '辰溪县', '溆浦县', '会同县', '麻阳苗族自治县', '新晃侗族自治县', '芷江侗族自治县', '靖州苗族侗族自治县', '通道侗族自治县', '洪江市'],
					'娄底市': ['娄星区', '双峰县', '新化县', '冷水江市', '涟源市'],
					'湘西土家族苗族自治州': ['吉首市', '泸溪县', '凤凰县', '花垣县', '保靖县', '古丈县', '永顺县', '龙山县']
				},
				'河北省': {
					'石家庄市': ['长安区', '桥西区', '新华区', '井陉矿区', '裕华区', '藁城区', '鹿泉区', '栾城区', '井陉县', '正定县', '行唐县', '灵寿县', '高邑县', '深泽县', '赞皇县', '无极县', '平山县', '元氏县', '赵县', '辛集市', '晋州市', '新乐市'],
					'唐山市': ['路南区', '路北区', '古冶区', '开平区', '丰南区', '丰润区', '曹妃甸区', '滦南县', '乐亭县', '迁西县', '玉田县', '遵化市', '迁安市', '滦州市'],
					'秦皇岛市': ['海港区', '山海关区', '北戴河区', '抚宁区', '青龙满族自治县', '昌黎县', '卢龙县'],
					'邯郸市': ['邯山区', '丛台区', '复兴区', '峰峰矿区', '肥乡区', '永年区', '临漳县', '成安县', '大名县', '涉县', '磁县', '邱县', '鸡泽县', '广平县', '馆陶县', '魏县', '曲周县', '武安市'],
					'邢台市': ['桥东区', '桥西区', '邢台县', '临城县', '内丘县', '柏乡县', '隆尧县', '任县', '南和县', '宁晋县', '巨鹿县', '新河县', '广宗县', '平乡县', '威县', '清河县', '临西县', '南宫市', '沙河市'],
					'保定市': ['竞秀区', '莲池区', '满城区', '清苑区', '徐水区', '涞水县', '阜平县', '定兴县', '唐县', '高阳县', '容城县', '涞源县', '望都县', '安新县', '易县', '曲阳县', '蠡县', '顺平县', '博野县', '雄县', '涿州市', '定州市', '安国市', '高碑店市'],
					'张家口市': ['桥东区', '桥西区', '宣化区', '下花园区', '万全区', '崇礼区', '张北县', '康保县', '沽源县', '尚义县', '蔚县', '阳原县', '怀安县', '怀来县', '涿鹿县', '赤城县'],
					'承德市': ['双桥区', '双滦区', '鹰手营子矿区', '承德县', '兴隆县', '平泉市', '滦平县', '隆化县', '丰宁满族自治县', '宽城满族自治县', '围场满族蒙古族自治县'],
					'沧州市': ['新华区', '运河区', '沧县', '青县', '东光县', '海兴县', '盐山县', '肃宁县', '南皮县', '吴桥县', '献县', '孟村回族自治县', '泊头市', '任丘市', '黄骅市', '河间市'],
					'廊坊市': ['安次区', '广阳区', '固安县', '永清县', '香河县', '大城县', '文安县', '大厂回族自治县', '霸州市', '三河市'],
					'衡水市': ['桃城区', '冀州区', '枣强县', '武邑县', '武强县', '饶阳县', '安平县', '故城县', '景县', '阜城县', '深州市']
				},
				'福建省': {
					'福州市': ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '长乐区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '福清市'],
					'厦门市': ['思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区'],
					'莆田市': ['城厢区', '涵江区', '荔城区', '秀屿区', '仙游县'],
					'三明市': ['梅列区', '三元区', '明溪县', '清流县', '宁化县', '大田县', '尤溪县', '沙县', '将乐县', '泰宁县', '建宁县', '永安市'],
					'泉州市': ['鲤城区', '丰泽区', '洛江区', '泉港区', '惠安县', '安溪县', '永春县', '德化县', '金门县', '石狮市', '晋江市', '南安市'],
					'漳州市': ['芗城区', '龙文区', '云霄县', '漳浦县', '诏安县', '长泰县', '东山县', '南靖县', '平和县', '华安县', '龙海市'],
					'南平市': ['延平区', '建阳区', '顺昌县', '浦城县', '光泽县', '松溪县', '政和县', '邵武市', '武夷山市', '建瓯市'],
					'龙岩市': ['新罗区', '永定区', '长汀县', '上杭县', '武平县', '连城县', '漳平市'],
					'宁德市': ['蕉城区', '霞浦县', '古田县', '屏南县', '寿宁县', '周宁县', '柘荣县', '福安市', '福鼎市']
				},
				'安徽省': {
					'合肥市': ['瑶海区', '庐阳区', '蜀山区', '包河区', '长丰县', '肥东县', '肥西县', '庐江县', '巢湖市'],
					'芜湖市': ['镜湖区', '弋江区', '鸠江区', '三山区', '芜湖县', '繁昌县', '南陵县', '无为市'],
					'蚌埠市': ['龙子湖区', '蚌山区', '禹会区', '淮上区', '怀远县', '五河县', '固镇县'],
					'淮南市': ['大通区', '田家庵区', '谢家集区', '八公山区', '潘集区', '凤台县', '寿县'],
					'马鞍山市': ['花山区', '雨山区', '博望区', '当涂县', '含山县', '和县'],
					'淮北市': ['杜集区', '相山区', '烈山区', '濉溪县'],
					'铜陵市': ['铜官区', '义安区', '郊区', '枞阳县'],
					'安庆市': ['迎江区', '大观区', '宜秀区', '怀宁县', '太湖县', '宿松县', '望江县', '岳西县', '桐城市', '潜山市'],
					'黄山市': ['屯溪区', '黄山区', '徽州区', '歙县', '休宁县', '黟县', '祁门县'],
					'滁州市': ['琅琊区', '南谯区', '来安县', '全椒县', '定远县', '凤阳县', '天长市', '明光市'],
					'阜阳市': ['颍州区', '颍东区', '颍泉区', '临泉县', '太和县', '阜南县', '颍上县', '界首市'],
					'宿州市': ['埇桥区', '砀山县', '萧县', '灵璧县', '泗县'],
					'六安市': ['金安区', '裕安区', '叶集区', '霍邱县', '霍山县', '舒城县', '金寨县'],
					'亳州市': ['谯城区', '涡阳县', '蒙城县', '利辛县'],
					'池州市': ['贵池区', '东至县', '石台县', '青阳县'],
					'宣城市': ['宣州区', '郎溪县', '广德市', '泾县', '绩溪县', '旌德县', '宁国市']
				},
				'江西省': {
					'南昌市': ['东湖区', '西湖区', '青云谱区', '湾里区', '青山湖区', '新建区', '南昌县', '安义县', '进贤县'],
					'景德镇市': ['昌江区', '珠山区', '浮梁县', '乐平市'],
					'萍乡市': ['安源区', '湘东区', '莲花县', '上栗县', '芦溪县'],
					'九江市': ['濂溪区', '浔阳区', '柴桑区', '武宁县', '修水县', '永修县', '德安县', '都昌县', '湖口县', '彭泽县', '瑞昌市', '共青城市', '庐山市'],
					'新余市': ['渝水区', '分宜县'],
					'鹰潭市': ['月湖区', '余江区', '贵溪市'],
					'赣州市': ['章贡区', '南康区', '赣县区', '信丰县', '大余县', '上犹县', '崇义县', '安远县', '龙南县', '定南县', '全南县', '宁都县', '于都县', '兴国县', '会昌县', '寻乌县', '石城县', '瑞金市'],
					'吉安市': ['吉州区', '青原区', '吉安县', '吉水县', '峡江县', '新干县', '永丰县', '泰和县', '遂川县', '万安县', '安福县', '永新县', '井冈山市'],
					'宜春市': ['袁州区', '奉新县', '万载县', '上高县', '宜丰县', '靖安县', '铜鼓县', '丰城市', '樟树市', '高安市'],
					'抚州市': ['临川区', '东乡区', '南城县', '黎川县', '南丰县', '崇仁县', '乐安县', '宜黄县', '金溪县', '资溪县', '广昌县'],
					'上饶市': ['信州区', '广丰区', '广信区', '玉山县', '铅山县', '横峰县', '弋阳县', '余干县', '鄱阳县', '万年县', '婺源县', '德兴市']
				},
				'辽宁省': {
					'沈阳市': ['和平区', '沈河区', '大东区', '皇姑区', '铁西区', '苏家屯区', '浑南区', '沈北新区', '于洪区', '辽中区', '康平县', '法库县', '新民市'],
					'大连市': ['中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区', '普兰店区', '长海县', '瓦房店市', '庄河市'],
					'鞍山市': ['铁东区', '铁西区', '立山区', '千山区', '台安县', '岫岩满族自治县', '海城市'],
					'抚顺市': ['新抚区', '东洲区', '望花区', '顺城区', '抚顺县', '新宾满族自治县', '清原满族自治县'],
					'本溪市': ['平山区', '溪湖区', '明山区', '南芬区', '本溪满族自治县', '桓仁满族自治县'],
					'丹东市': ['元宝区', '振兴区', '振安区', '宽甸满族自治县', '东港市', '凤城市'],
					'锦州市': ['古塔区', '凌河区', '太和区', '黑山县', '义县', '凌海市', '北镇市'],
					'营口市': ['站前区', '西市区', '鲅鱼圈区', '老边区', '盖州市', '大石桥市'],
					'阜新市': ['海州区', '新邱区', '太平区', '清河门区', '细河区', '阜新蒙古族自治县', '彰武县'],
					'辽阳市': ['白塔区', '文圣区', '宏伟区', '弓长岭区', '太子河区', '辽阳县', '灯塔市'],
					'盘锦市': ['兴隆台区', '双台子区', '大洼区', '盘山县'],
					'铁岭市': ['银州区', '清河区', '铁岭县', '西丰县', '昌图县', '调兵山市', '开原市'],
					'朝阳市': ['双塔区', '龙城区', '朝阳县', '建平县', '喀喇沁左翼蒙古族自治县', '北票市', '凌源市'],
					'葫芦岛市': ['连山区', '龙港区', '南票区', '绥中县', '建昌县', '兴城市']
				},
				'黑龙江省': {
					'哈尔滨市': ['道里区', '南岗区', '道外区', '平房区', '松北区', '香坊区', '呼兰区', '阿城区', '双城区', '依兰县', '方正县', '宾县', '巴彦县', '木兰县', '通河县', '延寿县', '尚志市', '五常市'],
					'齐齐哈尔市': ['龙沙区', '建华区', '铁锋区', '昂昂溪区', '富拉尔基区', '碾子山区', '梅里斯达斡尔族区', '龙江县', '依安县', '泰来县', '甘南县', '富裕县', '克山县', '克东县', '拜泉县', '讷河市'],
					'鸡西市': ['鸡冠区', '恒山区', '滴道区', '梨树区', '城子河区', '麻山区', '鸡东县', '虎林市', '密山市'],
					'鹤岗市': ['向阳区', '工农区', '南山区', '兴安区', '东山区', '兴山区', '萝北县', '绥滨县'],
					'双鸭山市': ['尖山区', '岭东区', '四方台区', '宝山区', '集贤县', '友谊县', '宝清县', '饶河县'],
					'大庆市': ['萨尔图区', '龙凤区', '让胡路区', '红岗区', '大同区', '肇州县', '肇源县', '林甸县', '杜尔伯特蒙古族自治县'],
					'伊春市': ['伊美区', '乌翠区', '友好区', '金林区', '汤旺县', '丰林县', '大箐山县', '南岔县', '铁力市'],
					'佳木斯市': ['向阳区', '前进区', '东风区', '郊区', '桦南县', '桦川县', '汤原县', '抚远市', '同江市', '富锦市'],
					'七台河市': ['新兴区', '桃山区', '茄子河区', '勃利县'],
					'牡丹江市': ['东安区', '阳明区', '爱民区', '西安区', '东宁市', '林口县', '绥芬河市', '海林市', '宁安市', '穆棱市'],
					'黑河市': ['爱辉区', '逊克县', '孙吴县', '北安市', '五大连池市', '嫩江市'],
					'绥化市': ['北林区', '望奎县', '兰西县', '青冈县', '庆安县', '明水县', '绥棱县', '安达市', '肇东市', '海伦市'],
					'大兴安岭地区': ['呼玛县', '塔河县', '漠河市']
				},
				'吉林省': {
					'长春市': ['南关区', '宽城区', '朝阳区', '二道区', '绿园区', '双阳区', '九台区', '农安县', '榆树市', '德惠市'],
					'吉林市': ['昌邑区', '龙潭区', '船营区', '丰满区', '永吉县', '蛟河市', '桦甸市', '舒兰市', '磐石市'],
					'四平市': ['铁西区', '铁东区', '梨树县', '伊通满族自治县', '公主岭市', '双辽市'],
					'辽源市': ['龙山区', '西安区', '东丰县', '东辽县'],
					'通化市': ['东昌区', '二道江区', '通化县', '辉南县', '柳河县', '梅河口市', '集安市'],
					'白山市': ['浑江区', '江源区', '抚松县', '靖宇县', '长白朝鲜族自治县', '临江市'],
					'松原市': ['宁江区', '前郭尔罗斯蒙古族自治县', '长岭县', '乾安县', '扶余市'],
					'白城市': ['洮北区', '镇赊县', '通榆县', '洮南市', '大安市'],
					'延边朝鲜族自治州': ['延吉市', '图们市', '敦化市', '珲春市', '龙井市', '和龙市', '安图县', '汪清县']
				},
				'山西省': {
					'太原市': ['小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区', '晋源区', '清徐县', '阳曲县', '娄烦县', '古交市'],
					'大同市': ['平城区', '云冈区', '新荣区', '云州区', '阳高县', '天镇县', '广灵县', '灵丘县', '浑源县', '左云县'],
					'阳泉市': ['城区', '矿区', '郊区', '平定县', '盂县'],
					'长治市': ['潞州区', '上党区', '屯留区', '潞城区', '襄垣县', '平顺县', '黎城县', '壶关县', '长子县', '武乡县', '沁县', '沁源县'],
					'晋城市': ['城区', '沁水县', '阳城县', '陵川县', '泽州县', '高平市'],
					'朔州市': ['朔城区', '平鲁区', '山阴县', '应县', '右玉县', '怀仁市'],
					'晋中市': ['榆次区', '太谷区', '榆社县', '左权县', '和顺县', '昔阳县', '寿阳县', '祁县', '平遥县', '灵石县', '介休市'],
					'运城市': ['盐湖区', '临猗县', '万荣县', '闻喜县', '稷山县', '新绛县', '绛县', '垣曲县', '夏县', '平陆县', '芮城县', '永济市', '河津市'],
					'忻州市': ['忻府区', '定襄县', '五台县', '代县', '繁峙县', '宁武县', '静乐县', '神池县', '五寨县', '岢岚县', '河曲县', '保德县', '偏关县', '原平市'],
					'临汾市': ['尧都区', '曲沃县', '翼城县', '襄汾县', '洪洞县', '古县', '安泽县', '浮山县', '吉县', '乡宁县', '大宁县', '隰县', '永和县', '蒲县', '汾西县', '侯马市', '霍州市'],
					'吕梁市': ['离石区', '文水县', '交城县', '兴县', '临县', '柳林县', '石楼县', '岚县', '方山县', '中阳县', '交口县', '孝义市', '汾阳市']
				},
				'陕西省': {
					'西安市': ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区', '鄠邑区', '蓝田县', '周至县'],
					'铜川市': ['王益区', '印台区', '耀州区', '宜君县'],
					'宝鸡市': ['渭滨区', '金台区', '陈仓区', '凤翔区', '岐山县', '扶风县', '眉县', '陇县', '千阳县', '麟游县', '凤县', '太白县'],
					'咸阳市': ['秦都区', '杨陵区', '渭城区', '三原县', '泾阳县', '乾县', '礼泉县', '永寿县', '长武县', '旬邑县', '淳化县', '武功县', '兴平市', '彬州市'],
					'渭南市': ['临渭区', '华州区', '潼关县', '大荔县', '合阳县', '澄城县', '蒲城县', '白水县', '富平县', '韩城市', '华阴市'],
					'延安市': ['宝塔区', '安塞区', '延长县', '延川县', '志丹县', '吴起县', '甘泉县', '富县', '洛川县', '宜川县', '黄龙县', '黄陵县', '子长市'],
					'汉中市': ['汉台区', '南郑区', '城固县', '洋县', '西乡县', '勉县', '宁强县', '略阳县', '镇巴县', '留坝县', '佛坪县'],
					'榆林市': ['榆阳区', '横山区', '神木市', '府谷县', '靖边县', '定边县', '绥德县', '米脂县', '佳县', '吴堡县', '清涧县', '子洲县'],
					'安康市': ['汉滨区', '汉阴县', '石泉县', '宁陕县', '紫阳县', '岚皋县', '平利县', '镇坪县', '旬阳县', '白河县'],
					'商洛市': ['商州区', '洛南县', '丹凤县', '商南县', '山阳县', '镇安县', '柞水县']
				},
				'甘肃省': {
					'兰州市': ['城关区', '七里河区', '西固区', '安宁区', '红古区', '永登县', '皋兰县', '榆中县'],
					'嘉峪关市': ['嘉峪关市'],
					'金昌市': ['金川区', '永昌县'],
					'白银市': ['白银区', '平川区', '靖远县', '会宁县', '景泰县'],
					'天水市': ['秦州区', '麦积区', '清水县', '秦安县', '甘谷县', '武山县', '张家川回族自治县'],
					'武威市': ['凉州区', '民勤县', '古浪县', '天祝藏族自治县'],
					'张掖市': ['甘州区', '肃南裕固族自治县', '民乐县', '临泽县', '高台县', '山丹县'],
					'平凉市': ['崆峒区', '泾川县', '灵台县', '崇信县', '华亭市', '庄浪县', '静宁县'],
					'酒泉市': ['肃州区', '金塔县', '瓜州县', '肃北蒙古族自治县', '阿克塞哈萨克族自治县', '玉门市', '敦煌市'],
					'庆阳市': ['西峰区', '庆城县', '环县', '华池县', '合水县', '正宁县', '宁县', '镇原县'],
					'定西市': ['安定区', '通渭县', '陇西县', '渭源县', '临洮县', '漳县', '岷县'],
					'陇南市': ['武都区', '成县', '文县', '宕昌县', '康县', '西和县', '礼县', '徽县', '两当县'],
					'临夏回族自治州': ['临夏市', '临夏县', '康乐县', '永靖县', '广河县', '和政县', '东乡族自治县', '积石山保安族东乡族撒拉族自治县'],
					'甘南藏族自治州': ['合作市', '临潭县', '卓尼县', '舟曲县', '迭部县', '玛曲县', '碌曲县', '夏河县']
				},
				'青海省': {
					'西宁市': ['城东区', '城中区', '城西区', '城北区', '湟中区', '大通回族土族自治县', '湟源县'],
					'海东市': ['乐都区', '平安区', '民和回族土族自治县', '互助土族自治县', '化隆回族自治县', '循化撒拉族自治县'],
					'海北藏族自治州': ['门源回族自治县', '祁连县', '海晏县', '刚察县'],
					'黄南藏族自治州': ['同仁市', '尖扎县', '泽库县', '河南蒙古族自治县'],
					'海南藏族自治州': ['共和县', '同德县', '贵德县', '兴海县', '贵南县'],
					'果洛藏族自治州': ['玛沁县', '班玛县', '甘德县', '达日县', '久治县', '玛多县'],
					'玉树藏族自治州': ['玉树市', '杂多县', '称多县', '治多县', '囊谦县', '曲麻莱县'],
					'海西蒙古族藏族自治州': ['格尔木市', '德令哈市', '乌兰县', '都兰县', '天峻县']
				},
				'内蒙古自治区': {
					'呼和浩特市': ['新城区', '回民区', '玉泉区', '赛罕区', '土默特左旗', '托克托县', '和林格尔县', '清水河县', '武川县'],
					'包头市': ['东河区', '昆都仑区', '青山区', '石拐区', '白云鄂博矿区', '九原区', '土默特右旗', '固阳县', '达尔罕茂明安联合旗'],
					'乌海市': ['海勃湾区', '海南区', '乌达区'],
					'赤峰市': ['红山区', '元宝山区', '松山区', '阿鲁科尔沁旗', '巴林左旗', '巴林右旗', '林西县', '克什克腾旗', '翁牛特旗', '喀喇沁旗', '宁城县', '敖汉旗'],
					'通辽市': ['科尔沁区', '科尔沁左翼中旗', '科尔沁左翼后旗', '开鲁县', '库伦旗', '奈曼旗', '扎鲁特旗', '霍林郭勒市'],
					'鄂尔多斯市': ['东胜区', '康巴什区', '达拉特旗', '准格尔旗', '鄂托克前旗', '鄂托克旗', '杭锦旗', '乌审旗', '伊金霍洛旗'],
					'呼伦贝尔市': ['海拉尔区', '扎赉诺尔区', '阿荣旗', '莫力达瓦达斡尔族自治旗', '鄂伦春自治旗', '鄂温克族自治旗', '陈巴尔虎旗', '新巴尔虎左旗', '新巴尔虎右旗', '满洲里市', '牙克石市', '扎兰屯市', '额尔古纳市', '根河市'],
					'巴彦淖尔市': ['临河区', '五原县', '磴口县', '乌拉特前旗', '乌拉特中旗', '乌拉特后旗', '杭锦后旗'],
					'乌兰察布市': ['集宁区', '卓资县', '化德县', '商都县', '兴和县', '凉城县', '察哈尔右翼前旗', '察哈尔右翼中旗', '察哈尔右翼后旗', '四子王旗', '丰镇市'],
					'兴安盟': ['乌兰浩特市', '阿尔山市', '科尔沁右翼前旗', '科尔沁右翼中旗', '扎赉特旗', '突泉县'],
					'锡林郭勒盟': ['二连浩特市', '锡林浩特市', '阿巴嘎旗', '苏尼特左旗', '苏尼特右旗', '东乌珠穆沁旗', '西乌珠穆沁旗', '太仆寺旗', '镶黄旗', '正镶白旗', '正蓝旗', '多伦县'],
					'阿拉善盟': ['阿拉善左旗', '阿拉善右旗', '额济纳旗']
				},
				'广西壮族自治区': {
					'南宁市': ['兴宁区', '青秀区', '江南区', '西乡塘区', '良庆区', '邕宁区', '武鸣区', '隆安县', '马山县', '上林县', '宾阳县', '横州市'],
					'柳州市': ['城中区', '鱼峰区', '柳南区', '柳北区', '柳江区', '柳城县', '鹿寨县', '融安县', '融水苗族自治县', '三江侗族自治县'],
					'桂林市': ['秀峰区', '叠彩区', '象山区', '七星区', '雁山区', '临桂区', '阳朔县', '灵川县', '全州县', '兴安县', '永福县', '灌阳县', '龙胜各族自治县', '资源县', '平乐县', '荔浦市'],
					'梧州市': ['万秀区', '长洲区', '龙圩区', '苍梧县', '藤县', '蒙山县', '岑溪市'],
					'北海市': ['海城区', '银海区', '铁山港区', '合浦县'],
					'防城港市': ['港口区', '防城区', '上思县', '东兴市'],
					'钦州市': ['钦南区', '钦北区', '灵山县', '浦北县'],
					'贵港市': ['港北区', '港南区', '覃塘区', '平南县', '桂平市'],
					'玉林市': ['玉州区', '福绵区', '容县', '陆川县', '博白县', '兴业县', '北流市'],
					'百色市': ['右江区', '田阳区', '田东县', '平果市', '德保县', '那坡县', '凌云县', '乐业县', '田林县', '西林县', '隆林各族自治县'],
					'贺州市': ['八步区', '平桂区', '昭平县', '钟山县', '富川瑶族自治县'],
					'河池市': ['金城江区', '宜州区', '南丹县', '天峨县', '凤山县', '东兰县', '罗城仫佬族自治县', '环江毛南族自治县', '巴马瑶族自治县', '都安瑶族自治县', '大化瑶族自治县'],
					'来宾市': ['兴宾区', '忻城县', '象州县', '武宣县', '金秀瑶族自治县', '合山市'],
					'崇左市': ['江州区', '扶绥县', '宁明县', '龙州县', '大新县', '天等县', '凭祥市']
				},
				'西藏自治区': {
					'拉萨市': ['城关区', '堆龙德庆区', '达孜区', '林周县', '当雄县', '尼木县', '曲水县', '墨竹工卡县'],
					'日喀则市': ['桑珠孜区', '南木林县', '江孜县', '定日县', '萨迦县', '拉孜县', '昂仁县', '谢通门县', '白朗县', '仁布县', '康马县', '定结县', '仲巴县', '亚东县', '吉隆县', '聂拉木县', '萨嘎县', '岗巴县'],
					'昌都市': ['卡若区', '江达县', '贡觉县', '类乌齐县', '丁青县', '察雅县', '八宿县', '左贡县', '芒康县', '洛隆县', '边坝县'],
					'林芝市': ['巴宜区', '工布江达县', '米林县', '墨脱县', '波密县', '察隅县', '朗县'],
					'山南市': ['乃东区', '扎囊县', '贡嘎县', '桑日县', '琼结县', '曲松县', '措美县', '洛扎县', '加查县', '隆子县', '错那县', '浪卡子县'],
					'那曲市': ['色尼区', '嘉黎县', '比如县', '聂荣县', '安多县', '申扎县', '索县', '班戈县', '巴青县', '尼玛县', '双湖县'],
					'阿里地区': ['普兰县', '札达县', '噶尔县', '日土县', '革吉县', '改则县', '措勤县']
				},
				'宁夏回族自治区': {
					'银川市': ['兴庆区', '西夏区', '金凤区', '永宁县', '贺兰县', '灵武市'],
					'石嘴山市': ['大武口区', '惠农区', '平罗县'],
					'吴忠市': ['利通区', '红寺堡区', '盐池县', '同心县', '青铜峡市'],
					'固原市': ['原州区', '西吉县', '隆德县', '泾源县', '彭阳县'],
					'中卫市': ['沙坡头区', '中宁县', '海原县']
				},
				'新疆维吾尔自治区': {
					'乌鲁木齐市': ['天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区', '达坂城区', '米东区', '乌鲁木齐县'],
					'克拉玛依市': ['独山子区', '克拉玛依区', '白碱滩区', '乌尔禾区'],
					'吐鲁番市': ['高昌区', '鄯善县', '托克逊县'],
					'哈密市': ['伊州区', '巴里坤哈萨克自治县', '伊吾县'],
					'昌吉回族自治州': ['昌吉市', '阜康市', '呼图壁县', '玛纳斯县', '奇台县', '吉木萨尔县', '木垒哈萨克自治县'],
					'博尔塔拉蒙古自治州': ['博乐市', '阿拉山口市', '精河县', '温泉县'],
					'巴音郭楞蒙古自治州': ['库尔勒市', '轮台县', '尉犁县', '若羌县', '且末县', '焉耆回族自治县', '和静县', '和硕县', '博湖县'],
					'阿克苏地区': ['阿克苏市', '温宿县', '库车市', '沙雅县', '新和县', '拜城县', '乌什县', '阿瓦提县', '柯坪县'],
					'克孜勒苏柯尔克孜自治州': ['阿图什市', '阿克陶县', '阿合奇县', '乌恰县'],
					'喀什地区': ['喀什市', '疏附县', '疏勒县', '英吉沙县', '泽普县', '莎车县', '叶城县', '麦盖提县', '岳普湖县', '伽师县', '巴楚县', '塔什库尔干塔吉克自治县'],
					'和田地区': ['和田市', '和田县', '墨玉县', '皮山县', '洛浦县', '策勒县', '于田县', '民丰县'],
					'伊犁哈萨克自治州': ['伊宁市', '奎屯市', '霍尔果斯市', '伊宁县', '察布查尔锡伯自治县', '霍城县', '巩留县', '新源县', '昭苏县', '特克斯县', '尼勒克县'],
					'塔城地区': ['塔城市', '乌苏市', '额敏县', '沙湾市', '托里县', '裕民县', '和布克赛尔蒙古自治县'],
					'阿勒泰地区': ['阿勒泰市', '布尔津县', '富蕴县', '福海县', '哈巴河县', '青河县', '吉木乃县']
				},
				'海南省': {
					'海口市': ['秀英区', '龙华区', '琼山区', '美兰区'],
					'三亚市': ['海棠区', '吉阳区', '天涯区', '崖州区'],
					'三沙市': ['西沙区', '南沙区'],
					'儋州市': ['那大镇', '和庆镇', '南丰镇', '大成镇', '雅星镇', '兰洋镇', '光村镇', '木棠镇', '海头镇', '峨蔓镇', '王五镇', '白马井镇', '中和镇', '排浦镇', '东成镇', '新州镇'],
					'省直辖县级行政单位': ['五指山市', '琼海市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县']
				},
				'贵州省': {
					'贵阳市': ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区', '开阳县', '息烽县', '修文县', '清镇市'],
					'六盘水市': ['钟山区', '六枝特区', '水城区', '盘州市'],
					'遵义市': ['红花岗区', '汇川区', '播州区', '桐梓县', '绥阳县', '正安县', '道真仡佬族苗族自治县', '务川仡佬族苗族自治县', '凤冈县', '湄潭县', '余庆县', '习水县', '赤水市', '仁怀市'],
					'安顺市': ['西秀区', '平坝区', '普定县', '镇宁布依族苗族自治县', '关岭布依族苗族自治县', '紫云苗族布依族自治县'],
					'毕节市': ['七星关区', '大方县', '黔西市', '金沙县', '织金县', '纳雍县', '威宁彝族回族苗族自治县', '赫章县'],
					'铜仁市': ['碧江区', '万山区', '江口县', '玉屏侗族自治县', '石阡县', '思南县', '印江土家族苗族自治县', '德江县', '沿河土家族自治县', '松桃苗族自治县'],
					'黔西南布依族苗族自治州': ['兴义市', '兴仁市', '普安县', '晴隆县', '贞丰县', '望谟县', '册亨县', '安龙县'],
					'黔东南苗族侗族自治州': ['凯里市', '黄平县', '施秉县', '三穗县', '镇远县', '岑巩县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '从江县', '雷山县', '麻江县', '丹寨县'],
					'黔南布依族苗族自治州': ['都匀市', '福泉市', '荔波县', '贵定县', '瓮安县', '独山县', '平塘县', '罗甸县', '长顺县', '龙里县', '惠水县', '三都水族自治县']
				},
				'云南省': {
					'昆明市': ['五华区', '盘龙区', '官渡区', '西山区', '东川区', '呈贡区', '晋宁区', '富民县', '宜良县', '石林彝族自治县', '嵩明县', '禄劝彝族苗族自治县', '寻甸回族彝族自治县', '安宁市'],
					'曲靖市': ['麒麟区', '沾益区', '马龙区', '陆良县', '师宗县', '罗平县', '富源县', '会泽县', '宣威市'],
					'玉溪市': ['红塔区', '江川区', '澄江市', '通海县', '华宁县', '易门县', '峨山彝族自治县', '新平彝族傣族自治县', '元江哈尼族彝族傣族自治县'],
					'保山市': ['隆阳区', '施甸县', '龙陵县', '昌宁县', '腾冲市'],
					'昭通市': ['昭阳区', '鲁甸县', '巧家县', '盐津县', '大关县', '永善县', '绥江县', '镇雄县', '彝良县', '威信县', '水富市'],
					'丽江市': ['古城区', '玉龙纳西族自治县', '永胜县', '华坪县', '宁蒗彝族自治县'],
					'普洱市': ['思茅区', '宁洱哈尼族彝族自治县', '墨江哈尼族自治县', '景东彝族自治县', '景谷傣族彝族自治县', '镇沅彝族哈尼族拉祜族自治县', '江城哈尼族彝族自治县', '孟连傣族拉祜族佤族自治县', '澜沧拉祜族自治县', '西盟佤族自治县'],
					'临沧市': ['临翔区', '凤庆县', '云县', '永德县', '镇康县', '双江拉祜族佤族布朗族傣族自治县', '耿马傣族佤族自治县', '沧源佤族自治县'],
					'楚雄彝族自治州': ['楚雄市', '双柏县', '牟定县', '南华县', '姚安县', '大姚县', '永仁县', '元谋县', '武定县', '禄丰市'],
					'红河哈尼族彝族自治州': ['个旧市', '开远市', '蒙自市', '弥勒市', '屏边苗族自治县', '建水县', '石屏县', '泸西县', '元阳县', '红河县', '金平苗族瑶族傣族自治县', '绿春县', '河口瑶族自治县'],
					'文山壮族苗族自治州': ['文山市', '砚山县', '西畴县', '麻栗坡县', '马关县', '丘北县', '广南县', '富宁县'],
					'西双版纳傣族自治州': ['景洪市', '勐海县', '勐腊县'],
					'大理白族自治州': ['大理市', '祥云县', '宾川县', '弥渡县', '永平县', '云龙县', '洱源县', '剑川县', '鹤庆县', '漾濞彝族自治县', '南涧彝族自治县', '巍山彝族回族自治县'],
					'德宏傣族景颇族自治州': ['瑞丽市', '芒市', '梁河县', '盈江县', '陇川县'],
					'怒江傈僳族自治州': ['泸水市', '福贡县', '贡山独龙族怒族自治县', '兰坪白族普米族自治县'],
					'迪庆藏族自治州': ['香格里拉市', '德钦县', '维西傈僳族自治县']
				}
			},

			// Location index
			locationIndex: {
				province: 0,
				city: 0,
				district: 0
			},

			provinces: [],
			cities: [],
			districts: [],

			// Activity tags
			activityTags: [
				{id: 'second-life', name: '第二人生', icon: '🌅'},
				{id: 'arts', name: '琴棋书画', icon: '🎨'},
				{id: 'health', name: '自然健康', icon: '🌿'},
				{id: 'medicine', name: '中医养生', icon: '🏮'},
				{id: 'heritage', name: '非遗文化', icon: '🎭'},
				{id: 'travel', name: '文旅研学', icon: '✈️'},
				{id: 'lifestyle', name: '品鉴生活', icon: '🍵'},
				{id: 'charity', name: '公益行动', icon: '❤️'},
				{id: 'tech', name: '时代科技', icon: '💻'}
			],

			// Registration fields
			personalFields: [
				{id: 'name', label: '姓名', required: true},
				{id: 'phone', label: '联系电话', required: true},
				{id: 'wechat', label: '微信号', required: false},
				{id: 'gender', label: '性别', required: false},
				{id: 'age', label: '年龄', required: false},
				{id: 'city', label: '所在城市', required: false},
				{id: 'idcard', label: '身份证号', required: false},
				{id: 'education', label: '学历', required: false},
				{id: 'occupation', label: '职业', required: false}
			],

			teamFields: [
				{id: 'teamName', label: '团队名称', required: true},
				{id: 'leaderName', label: '团长姓名', required: true},
				{id: 'leaderPhone', label: '团长联系电话', required: true},
				{id: 'programName', label: '节目名称', required: true},
				{id: 'programType', label: '节目类型', required: true},
				{id: 'participantCount', label: '参加人数', required: true},
				{id: 'teamIntro', label: '团队简介', required: false}
			],

			moduleTypes: ['单行文本', '多行文本', '单选', '多选', '数字', '日期']
		}
	},

	onLoad() {
		this.initializeLocationData()
		this.loadDraft()
		this.loadHistoryActivities()
		this.setupScrollListener()
	},

	onUnload() {
		this.saveDraft(true) // Auto-save on page unload
	},

	watch: {
		searchKeyword: {
			handler(newVal) {
				console.log('搜索关键词变化:', newVal)
				this.filterHistory()
			},
			immediate: true
		}
	},

	methods: {
		// History selector methods
		loadHistoryActivities() {
			try {
				const history = uni.getStorageSync('activityHistory') || []
				this.historyData = history
				this.filteredHistoryActivities = history
				console.log('📚 已加载历史活动数据:', history.length, '条')
			} catch (e) {
				console.error('❌ 加载历史活动失败:', e)
				this.historyData = []
				this.filteredHistoryActivities = []
			}
		},

		toggleHistoryDropdown() {
			this.showHistoryDropdown = !this.showHistoryDropdown
			if (this.showHistoryDropdown) {
				// 点击其他地方关闭下拉框
				setTimeout(() => {
					uni.$on('clickOutside', this.closeHistoryDropdown)
				}, 100)
			} else {
				this.closeHistoryDropdown()
			}
		},

		closeHistoryDropdown() {
			this.showHistoryDropdown = false
			uni.$off('clickOutside', this.closeHistoryDropdown)
		},

		filterHistoryActivities() {
			if (!this.historySearchKeyword.trim()) {
				this.filteredHistoryActivities = this.historyData
				return
			}

			const keyword = this.historySearchKeyword.toLowerCase()
			this.filteredHistoryActivities = this.historyData.filter(activity => {
				return (activity.name && activity.name.toLowerCase().includes(keyword)) ||
				       (activity.shortDesc && activity.shortDesc.toLowerCase().includes(keyword)) ||
				       (activity.province && activity.province.toLowerCase().includes(keyword)) ||
				       (activity.city && activity.city.toLowerCase().includes(keyword))
			})
		},

		selectHistoryActivity(activity) {
			console.log('📋 选择历史活动:', activity.name)
			this.selectedHistoryActivity = activity
			this.showHistoryDropdown = false

			// 使用现有的填充方法
			this.fillFromHistory(activity)

			// 显示成功提示
			uni.showToast({
				title: '已填充历史活动数据',
				icon: 'success',
				duration: 2000
			})
		},

		handlePageTap() {
			if (this.showHistoryDropdown) {
				this.closeHistoryDropdown()
			}
		},

		// Navigation methods
		navigateToStep(step) {
			const element = uni.createSelectorQuery().select(`#step-${step}`)
			element.boundingClientRect(rect => {
				if (rect) {
					this.scrollTop = rect.top - 100
					this.currentStep = step
					this.updateProgress()
				}
			}).exec()
		},

		handleScroll(e) {
			const scrollTop = e.detail.scrollTop
			this.scrollTop = scrollTop

			// Auto-update current step based on scroll position
			const steps = [1, 2, 3, 4]
			for (let i = steps.length - 1; i >= 0; i--) {
				const element = uni.createSelectorQuery().select(`#step-${steps[i]}`)
				element.boundingClientRect(rect => {
					if (rect && rect.top <= 150) {
						if (this.currentStep !== steps[i]) {
							this.currentStep = steps[i]
							this.updateProgress()
						}
					}
				}).exec()
			}
		},

		updateProgress() {
			this.progressWidth = (this.currentStep / 4) * 100
		},

		setupScrollListener() {
			// Setup scroll listener for smart navigation
		},

		// Location data initialization
		initializeLocationData() {
			this.provinces = Object.keys(this.locationData)
			if (this.provinces.length > 0) {
				this.updateCities(this.provinces[0])
			}
		},

		updateCities(province) {
			this.cities = Object.keys(this.locationData[province] || {})
			if (this.cities.length > 0) {
				this.updateDistricts(province, this.cities[0])
			}
		},

		updateDistricts(province, city) {
			this.districts = this.locationData[province]?.[city] || []
		},

		// Form validation
		validateField(field) {
			const value = this.formData[field]
			this.errors = {...this.errors, [field]: ''}

			switch(field) {
				case 'name':
					if (!value || value.trim().length < 2) {
						this.errors[field] = '活动名称至少需要2个字符'
					}
					break
				case 'shortDesc':
					if (!value || value.trim().length < 5) {
						this.errors[field] = '简介至少需要5个字符'
					}
					break
				case 'address':
					if (!value || value.trim().length < 5) {
						this.errors[field] = '请输入详细地址'
					}
					break
			}
		},

		validateForm() {
			let isValid = true
			const requiredFields = ['name', 'shortDesc', 'startTime', 'endTime', 'address']

			requiredFields.forEach(field => {
				this.validateField(field)
				if (this.errors[field]) {
					isValid = false
				}
			})

			return isValid
		},

	
	
		// Image upload
		uploadImage() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.formData.image = res.tempFilePaths[0]
				}
			})
		},

		// Date/time handling
		onStartTimeChange(e) {
			this.formData.startTime = e.detail.value
		},

		onEndTimeChange(e) {
			this.formData.endTime = e.detail.value
		},

		// Location handling
		onProvinceChange(e) {
			this.locationIndex.province = e.detail.value
			const selectedProvince = this.provinces[e.detail.value]
			this.formData.province = selectedProvince
			this.updateCities(selectedProvince)
			this.locationIndex.city = 0
			this.locationIndex.district = 0
		},

		onCityChange(e) {
			this.locationIndex.city = e.detail.value
			const selectedProvince = this.provinces[this.locationIndex.province]
			const selectedCity = this.cities[e.detail.value]
			this.formData.city = selectedCity
			this.updateDistricts(selectedProvince, selectedCity)
			this.locationIndex.district = 0
		},

		onDistrictChange(e) {
			this.locationIndex.district = e.detail.value
			const selectedProvince = this.provinces[this.locationIndex.province]
			const selectedCity = this.cities[this.locationIndex.city]
			const selectedDistrict = this.districts[e.detail.value]
			this.formData.district = selectedDistrict
		},

		copyAddress() {
			const fullAddress = `${this.formData.province}${this.formData.city}${this.formData.district}${this.formData.address}`
			uni.setClipboardData({
				data: fullAddress,
				success: () => {
					uni.showToast({title: '地址已复制', icon: 'success'})
				}
			})
		},

		// Tag handling
		toggleTag(tagId) {
			const index = this.formData.tags.indexOf(tagId)
			if (index > -1) {
				this.formData.tags.splice(index, 1)
			} else {
				this.formData.tags.push(tagId)
			}
		},

		// Section toggles
		toggleSection(section) {
			this.sections[section] = !this.sections[section]
		},

		// Registration settings
		toggleRegistrationType(type) {
			switch(type) {
				case 'individual':
					this.formData.registration.allowIndividual = !this.formData.registration.allowIndividual
					break
				case 'team':
					this.formData.registration.allowTeam = !this.formData.registration.allowTeam
					break
				case 'approval':
					this.formData.registration.requireApproval = !this.formData.registration.requireApproval
					break
			}
		},

		toggleAllPersonalFields() {
			const allSelected = this.personalFields.every(field =>
				this.formData.registration.personalFields.includes(field.id)
			)

			if (allSelected) {
				this.formData.registration.personalFields = this.personalFields
					.filter(f => f.required)
					.map(f => f.id)
			} else {
				this.formData.registration.personalFields = this.personalFields.map(f => f.id)
			}
		},

		togglePersonalField(fieldId) {
			const field = this.personalFields.find(f => f.id === fieldId)
			if (field && !field.required) {
				const index = this.formData.registration.personalFields.indexOf(fieldId)
				if (index > -1) {
					this.formData.registration.personalFields.splice(index, 1)
				} else {
					this.formData.registration.personalFields.push(fieldId)
				}
			}
		},

		toggleAllTeamFields() {
			const allSelected = this.teamFields.every(field =>
				this.formData.registration.teamFields.includes(field.id)
			)

			if (allSelected) {
				this.formData.registration.teamFields = this.teamFields
					.filter(f => f.required)
					.map(f => f.id)
			} else {
				this.formData.registration.teamFields = this.teamFields.map(f => f.id)
			}
		},

		toggleTeamField(fieldId) {
			const field = this.teamFields.find(f => f.id === fieldId)
			if (field && !field.required) {
				const index = this.formData.registration.teamFields.indexOf(fieldId)
				if (index > -1) {
					this.formData.registration.teamFields.splice(index, 1)
				} else {
					this.formData.registration.teamFields.push(fieldId)
				}
			}
		},

		// Custom fields
		addCustomField() {
			const newField = {
				id: 'custom_' + Date.now(),
				name: '',
				description: '',
				required: false
			}
			this.formData.registration.customFields.push(newField)
		},

		removeCustomField(index) {
			this.formData.registration.customFields.splice(index, 1)
		},

		toggleCustomFieldRequired(index) {
			this.formData.registration.customFields[index].required =
				!this.formData.registration.customFields[index].required
		},

		// Custom modules
		addCustomModule() {
			const newModule = {
				id: 'module_' + Date.now(),
				title: '',
				type: '单行文本'
			}
			this.formData.settings.customModules.push(newModule)
		},

		removeCustomModule(index) {
			this.formData.settings.customModules.splice(index, 1)
		},

		onModuleTypeChange(e, index) {
			this.formData.settings.customModules[index].type = this.moduleTypes[e.detail.value]
		},

		// Settings
		onCustomerServiceChange(e) {
			this.formData.settings.customerService = e.detail.value
		},

		// Draft management
		saveDraft(isAutoSave = false) {
			try {
				uni.setStorageSync('activityDraft', this.formData)
				if (!isAutoSave) {
					uni.showToast({title: '草稿已保存', icon: 'success'})
				}
			} catch (e) {
				console.error('Failed to save draft:', e)
			}
		},

		loadDraft() {
			try {
				const draft = uni.getStorageSync('activityDraft')
				if (draft) {
					this.formData = {...this.formData, ...draft}
						}
			} catch (e) {
				console.error('Failed to load draft:', e)
			}
		},

		// Submit for review
		async submitForReview() {
			if (!this.validateForm()) {
				uni.showToast({title: '请填写必填项', icon: 'error'})
				return
			}

			try {
				// 准备提交数据
				const activityData = {
					title: this.formData.title,
					description: this.formData.description,
					category: this.formData.category,
					startTime: this.formData.startTime,
					endTime: this.formData.endTime,
					location: this.formData.location,
					maxParticipants: this.formData.maxParticipants,
					registrationDeadline: this.formData.registrationDeadline,
					fee: this.formData.fee,
					images: this.formData.images || [],
					requirements: this.formData.requirements || '',
					contact: this.formData.contact || ''
				}

				// 调用API创建活动
				const response = await activityService.createActivity(activityData)

				if (response.code === 200) {
					// Save to history before submission
					this.saveToHistory()

					// Clear draft after successful submission
					try {
						uni.removeStorageSync('activityDraft')
					} catch (e) {
						console.error('Failed to clear draft:', e)
					}

					uni.showToast({title: '提交成功', icon: 'success'})
					// Navigate back to previous page
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					throw new Error(response.message || '提交失败')
				}
			} catch (error) {
				console.error('提交活动失败:', error)
				uni.showToast({
					title: error.message || '提交失败，请重试',
					icon: 'none'
				})
			}
		},

		// History Management Methods
		showHistoryModal() {
			this.showModal = true
			this.loadHistory()
		},

		closeHistoryModal() {
			this.showModal = false
			this.searchKeyword = ''
		},

		// Input event handlers
		onSearchInput(event) {
			console.log('🔍 搜索输入事件:', {
				value: event.detail.value,
				target: event.target,
				timestamp: new Date().toISOString()
			})
			// v-model会自动更新searchKeyword，watch会处理filterHistory
		},

		onSearchFocus() {
			console.log('🎯 搜索框获得焦点', {
				currentValue: this.searchKeyword,
				timestamp: new Date().toISOString()
			})
		},

		onSearchBlur() {
			console.log('🔄 搜索框失去焦点')
		},

		loadHistory() {
			try {
				const history = uni.getStorageSync('activityHistory') || []
				this.historyData = history
				this.filteredHistory = history
			} catch (e) {
				console.error('Failed to load history:', e)
				this.historyData = []
				this.filteredHistory = []
			}
		},

		saveToHistory() {
			try {
				const history = uni.getStorageSync('activityHistory') || []

				// Create history entry
				const historyEntry = {
					...this.formData,
					publishDate: new Date().toLocaleDateString('zh-CN'),
					publishTime: new Date().toLocaleTimeString('zh-CN'),
					id: 'history_' + Date.now()
				}

				// Add to beginning of array
				history.unshift(historyEntry)

				// Keep only last 50 entries
				if (history.length > 50) {
					history.splice(50)
				}

				uni.setStorageSync('activityHistory', history)
			} catch (e) {
				console.error('Failed to save to history:', e)
			}
		},

		filterHistory() {
			const keyword = this.searchKeyword.toLowerCase().trim()
			if (!keyword) {
				this.filteredHistory = [...this.historyData]
			} else {
				this.filteredHistory = this.historyData.filter(item => {
					return (item.name && item.name.toLowerCase().includes(keyword)) ||
						   (item.shortDesc && item.shortDesc.toLowerCase().includes(keyword)) ||
						   (item.province && item.province.toLowerCase().includes(keyword)) ||
						   (item.city && item.city.toLowerCase().includes(keyword))
				})
			}
		},

		onSearchInput(event) {
			// 处理输入事件，确保能正常输入
			console.log('Search input:', event.detail.value)
			// v-model会自动更新searchKeyword，这里只需要调用filterHistory
			this.filterHistory()
		},

		onSearchFocus() {
			// 输入框获得焦点时的处理
			console.log('Search input focused')
		},

		fillFromHistory(historyItem) {
			// Fill form data from history
			this.formData = {
				...this.formData,
				name: historyItem.name || '',
				shortDesc: historyItem.shortDesc || '',
				startTime: historyItem.startTime || '',
				endTime: historyItem.endTime || '',
				province: historyItem.province || '',
				city: historyItem.city || '',
				district: historyItem.district || '',
				address: historyItem.address || '',
				maxParticipants: historyItem.maxParticipants || '',
				fee: historyItem.fee || '',
				tags: historyItem.tags || [],
				details: historyItem.details || '',
				tips: historyItem.tips || '',
				contact: historyItem.contact || '',
				registration: historyItem.registration || {
					allowIndividual: true,
					allowTeam: true,
					requireApproval: false,
					personalFields: ['name', 'phone'],
					teamFields: ['teamName', 'leaderName', 'leaderPhone', 'programName', 'programType', 'participantCount'],
					customFields: []
				},
				settings: historyItem.settings || {
					customerService: false,
					customModules: []
				}
			}

			// Update location index if province exists
			if (historyItem.province) {
				const provinceIndex = this.provinces.indexOf(historyItem.province)
				if (provinceIndex !== -1) {
					this.locationIndex.province = provinceIndex
					this.updateCities(historyItem.province)

					if (historyItem.city) {
						const cityIndex = this.cities.indexOf(historyItem.city)
						if (cityIndex !== -1) {
							this.locationIndex.city = cityIndex
							this.updateDistricts(historyItem.province, historyItem.city)

							if (historyItem.district) {
								const districtIndex = this.districts.indexOf(historyItem.district)
								if (districtIndex !== -1) {
									this.locationIndex.district = districtIndex
								}
							}
						}
					}
				}
			}

			// Close modal and show success message
			this.closeHistoryModal()
			uni.showToast({
				title: '已填充表单数据',
				icon: 'success',
				duration: 2000
			})

			// Scroll to top
			this.scrollTop = 0

			// Auto-save draft after filling
			this.saveDraft(true)
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

// History Activity Selector Styles
.history-selector {
	position: relative;
}

.selector-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 20rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.selector-container:hover {
	background: #ffffff;
	border-color: $primary-cambridge-blue;
	box-shadow: 0 4rpx 12rpx rgba(117, 176, 156, 0.1);
}

.selector-container:active {
	transform: scale(0.98);
}

.selector-content {
	display: flex;
	align-items: center;
	flex: 1;
}

.selector-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.selector-text {
	font-size: 28rpx;
	color: #1e293b;
	font-weight: 500;
}

.selector-text.placeholder {
	color: #94a3b8;
}

.selector-arrow {
	transition: transform 0.3s ease;
}

.selector-arrow.arrow-up {
	transform: rotate(180deg);
}

.arrow-icon {
	font-size: 24rpx;
	color: #94a3b8;
}

.history-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: #ffffff;
	border: 2rpx solid #e2e8f0;
	border-radius: 20rpx;
	box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.1);
	z-index: 1000;
	margin-top: 8rpx;
	max-height: 800rpx;
}

.dropdown-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	border-bottom: 1px solid #e2e8f0;
}

.dropdown-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1e293b;
}

.dropdown-count {
	font-size: 24rpx;
	color: #94a3b8;
	background: #f8fafc;
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
}

.dropdown-search {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	border-bottom: 1px solid #e2e8f0;
	/* 确保搜索区域有足够空间 */
	min-height: 60rpx;
	width: 100%;
	box-sizing: border-box;
	/* 确保内容不会溢出 */
	overflow: visible;
}

.search-icon {
	font-size: 32rpx;
	color: #94a3b8;
	margin-right: 16rpx;
}

.history-search-input {
	flex: 1;
	height: 44rpx;
	line-height: 44rpx;
	padding: 0 16rpx;
	background: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #1e293b;
	outline: none;
	box-sizing: border-box;
	/* 最基本的文本显示设置 */
	white-space: pre;
	overflow: visible;
	text-overflow: clip;
	/* 确保输入框功能正常 */
	-webkit-appearance: none;
	appearance: none;
	/* 确保能获得焦点和输入 */
	pointer-events: auto !important;
	touch-action: auto !important;
	-webkit-user-select: auto !important;
	user-select: auto !important;
	caret-color: #1e293b;
	/* 基础文本设置 */
	text-align: left;
	font-family: inherit;
	letter-spacing: normal;
	word-spacing: normal;
}

.history-search-input::placeholder {
	color: #94a3b8;
	font-size: 28rpx;
}

.dropdown-list {
	max-height: 400rpx;
}

.dropdown-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	border-bottom: 1px solid #f1f5f9;
	cursor: pointer;
	transition: all 0.2s ease;
}

.dropdown-item:hover {
	background: #f8fafc;
}

.dropdown-item:active {
	background: #e2e8f0;
}

.dropdown-item:last-child {
	border-bottom: none;
}

.item-content {
	flex: 1;
}

.item-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1e293b;
	margin-bottom: 8rpx;
}

.item-desc {
	font-size: 24rpx;
	color: #64748b;
	margin-bottom: 8rpx;
}

.item-location {
	display: flex;
	align-items: center;
	font-size: 22rpx;
	color: #94a3b8;
}

.location-icon {
	font-size: 20rpx;
	margin-right: 6rpx;
}

.item-arrow {
	margin-left: 16rpx;
}

.item-arrow .arrow-icon {
	font-size: 32rpx;
	color: #cbd5e0;
}

.dropdown-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 32rpx;
}

.empty-icon {
	font-size: 64rpx;
	color: #cbd5e0;
	margin-bottom: 24rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #94a3b8;
	text-align: center;
}

// Container styles
.container {
	background-color: $uni-bg-color-grey;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

// Smart Navigation
.smart-nav {
	background-color: $uni-bg-color;
	padding: 24rpx;
	border-bottom: 1px solid $uni-border-color;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-number {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: $uni-bg-color-hover;
	color: $uni-text-color-grey;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	transition: all 0.3s ease;
}

.nav-item-active .nav-number {
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
	transform: scale(1.1);
}

.nav-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	transition: color 0.3s ease;
}

.nav-item-active .nav-text {
	color: $primary-cambridge-blue;
	font-weight: 500;
}

.nav-line {
	width: 60rpx;
	height: 2px;
	background-color: $uni-border-color;
}

.progress-bar {
	height: 4rpx;
	background-color: $uni-bg-color-hover;
	border-radius: 2rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, $primary-cambridge-blue, $primary-pistachio);
	transition: width 0.3s ease;
}

// Form Content
.form-content {
	height: calc(100vh - 200rpx);
}

.form-section {
	background-color: $uni-bg-color;
	margin: 24rpx;
	border-radius: $uni-border-radius-lg;
	padding: 32rpx;
	box-shadow: $shadow-sm;
	transition: all 0.3s ease;
}

.form-section:hover {
	transform: translateY(-2rpx);
	box-shadow: $shadow-md;
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}

.section-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
}

// Form Groups
.form-group {
	margin-bottom: 32rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: $uni-text-color;
	margin-bottom: 16rpx;
	font-weight: 500;
}

.form-label.required::after {
	content: ' *';
	color: $uni-color-error;
}

.form-input,
.form-textarea {
	width: 100%;
	padding: 24rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: 28rpx;
	background-color: $uni-bg-color;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
	transform: translateY(-2rpx);
}

.form-textarea {
	min-height: 120rpx;
	resize: vertical;
}

// Upload Area
.upload-area {
	border: 2rpx dashed $primary-cambridge-blue;
	border-radius: $uni-border-radius-lg;
	padding: 48rpx;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.upload-area:hover {
	background-color: rgba(117, 176, 156, 0.05);
	border-color: $primary-pistachio;
}

.upload-icon {
	font-size: 48rpx;
	margin-bottom: 16rpx;
}

.upload-text {
	font-size: 28rpx;
	color: $uni-text-color;
	margin-bottom: 8rpx;
}

.upload-hint {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.uploaded-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: 1;
}

// Character Count
.char-count {
	text-align: right;
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 8rpx;
}

.text-warning {
	color: $uni-color-warning;
}

.text-error {
	color: $uni-color-error;
}

// Time and Location Grids
.time-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.location-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.time-input-group,
.picker-input-group {
	position: relative;
}

.picker-input {
	padding: 24rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: 28rpx;
	background-color: $uni-bg-color;
	min-height: 80rpx;
	display: flex;
	align-items: center;
}

.input-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 8rpx;
}

.placeholder {
	color: $uni-text-color-placeholder;
}

.address-input-group {
	display: flex;
	gap: 16rpx;
}

.address-input-group .form-input {
	flex: 1;
}

.copy-btn {
	padding: 24rpx;
	background-color: $uni-bg-color-hover;
	border-radius: $uni-border-radius-base;
	border: 2rpx solid $uni-border-color;
	transition: all 0.3s ease;
}

.copy-btn:hover {
	background-color: $uni-bg-color;
}

.copy-icon {
	font-size: 24rpx;
}

// Form Row
.form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.form-group.half {
	margin-bottom: 0;
}

.price-input-group {
	position: relative;
}

.currency-symbol {
	position: absolute;
	left: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 28rpx;
	color: $uni-text-color;
	z-index: 1;
}

.price-input-group .form-input {
	padding-left: 48rpx;
}

// Tags
.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.tag-pill {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	background-color: $uni-bg-color-hover;
	border-radius: 32rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
	cursor: pointer;
}

.tag-pill:hover {
	transform: scale(1.05);
	background-color: $uni-bg-color;
	border-color: $primary-cambridge-blue;
}

.tag-selected {
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
	border-color: $primary-cambridge-blue;
}

.tag-emoji {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.tag-text {
	font-size: 24rpx;
}

// Rich Editor
.rich-editor {
	min-height: 200rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	padding: 24rpx;
	font-size: 28rpx;
	line-height: 1.5;
	outline: none;
	transition: all 0.3s ease;
}

.rich-editor:focus {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
}

.editor-placeholder {
	color: $uni-text-color-placeholder;
}

// Collapsible Sections
.collapsible-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	padding: 16rpx 0;
}

.collapse-icon {
	transition: transform 0.3s ease;
}

.collapse-icon.collapsed {
	transform: rotate(-90deg);
}

.arrow-icon {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.collapsible-content {
	margin-top: 16rpx;
}

// Registration Settings
.subsection-title {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
	margin-bottom: 24rpx;
}

.checkbox-group {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.checkbox-item {
	display: flex;
	align-items: flex-start;
	padding: 24rpx;
	background-color: $uni-bg-color-hover;
	border-radius: $uni-border-radius-base;
	transition: all 0.3s ease;
	cursor: pointer;
}

.checkbox-item:hover {
	background-color: $uni-bg-color;
}

.checkbox-content {
	margin-left: 16rpx;
	flex: 1;
}

.checkbox-label {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.checkbox-desc {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

// Fields Header
.fields-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.select-all-btn,
.add-btn {
	font-size: 24rpx;
	color: $primary-cambridge-blue;
	cursor: pointer;
}

.add-btn {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.add-icon {
	font-size: 24rpx;
}

// Fields Grid
.fields-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 12rpx;
}

.field-item {
	display: flex;
	align-items: center;
	padding: 16rpx;
	background-color: $uni-bg-color-hover;
	border-radius: $uni-border-radius-base;
	transition: all 0.3s ease;
}

.field-item:hover {
	background-color: $uni-bg-color;
}

.field-label {
	margin-left: 16rpx;
	font-size: 26rpx;
	color: $uni-text-color;
	flex: 1;
}

.text-required {
	color: $uni-color-error;
	font-size: 24rpx;
}

.text-optional {
	color: $uni-text-color-grey;
	font-size: 24rpx;
}

// Custom Fields
.custom-fields-container,
.custom-modules-container {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.custom-field-item,
.custom-module-item {
	padding: 24rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	background-color: $uni-bg-color;
}

.custom-field-header,
.custom-module-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.custom-field-name,
.custom-module-name {
	flex: 1;
	padding: 12rpx 16rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: 26rpx;
	background-color: $uni-bg-color;
}

.custom-field-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.required-toggle {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.toggle-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.remove-btn {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: $uni-color-error;
	color: $uni-text-color-inverse;
	border-radius: 50%;
	cursor: pointer;
	font-size: 20rpx;
}

.custom-field-desc {
	width: 100%;
	padding: 12rpx 16rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: 24rpx;
	background-color: $uni-bg-color;
}

.module-type-picker {
	width: 100%;
	padding: 12rpx 16rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: 24rpx;
	background-color: $uni-bg-color;
}

// Toggle Settings
.toggle-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	background-color: $uni-bg-color-hover;
	border-radius: $uni-border-radius-base;
	transition: all 0.3s ease;
}

.toggle-item:hover {
	background-color: $uni-bg-color;
}

.toggle-content {
	flex: 1;
}

.toggle-label {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.toggle-desc {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

// Bottom Bar
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: $uni-bg-color;
	border-top: 2rpx solid $uni-border-color;
	padding: 24rpx;
	z-index: 100;
}

.action-buttons {
	display: flex;
	gap: 16rpx;
}

.btn-secondary,
.btn-primary {
	flex: 1;
	padding: 24rpx;
	border-radius: $uni-border-radius-base;
	font-size: 28rpx;
	font-weight: 500;
	text-align: center;
	transition: all 0.3s ease;
	cursor: pointer;
	border: none;
}

.btn-secondary {
	background: linear-gradient(135deg, $primary-mindaro, $primary-pistachio);
	color: $primary-lion;
}

.btn-secondary:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 20rpx rgba(160, 202, 146, 0.3);
}

.btn-primary {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
	color: $uni-text-color-inverse;
}

.btn-primary:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 20rpx rgba(117, 176, 156, 0.3);
}

.btn-text {
	font-size: 28rpx;
	font-weight: 500;
}

// Error Messages
.error-text {
	color: $uni-color-error;
	font-size: 24rpx;
	margin-top: 8rpx;
}

// Responsive Design
@media (max-width: 375px) {
	.form-section {
		margin: 16rpx;
		padding: 24rpx;
	}

	.nav-container {
		padding: 0 8rpx;
	}

	.nav-text {
		font-size: 22rpx;
	}

	.form-row {
		grid-template-columns: 1fr;
	}

	.location-grid {
		grid-template-columns: 1fr;
	}

	.time-grid {
		grid-template-columns: 1fr;
	}

	.tags-container {
		gap: 12rpx;
	}

	.tag-pill {
		padding: 12rpx 16rpx;
	}
}

// Animation Classes
@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.form-section {
	animation: slideIn 0.5s ease-out;
}

// Input field focus enhancement
.form-input:focus,
.form-textarea:focus,
.rich-editor:focus {
	outline: none;
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
}

// Touch optimization for mobile
@media (hover: none) {
	.tag-pill:active,
	.btn-secondary:active,
	.btn-primary:active,
	.checkbox-item:active,
	.copy-btn:active {
		transform: scale(0.95);
	}
}

// Activity History Modal - Shadcn Style
.history-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
}

.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4rpx);
	opacity: 0;
	animation: fadeIn 0.3s ease-out forwards;
}

.modal-content {
	position: relative;
	background: #ffffff;
	border-radius: 32rpx;
	width: 100%;
	max-width: 800rpx;
	max-height: 85vh;
	margin: 0 auto;
	box-shadow:
		0 32rpx 64rpx rgba(0, 0, 0, 0.1),
		0 0 0 1rpx rgba(255, 255, 255, 0.05);
	z-index: 1;
	transform: scale(0.95) translateY(20rpx);
	opacity: 0;
	animation: modalSlideIn 0.3s ease-out forwards;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

// Modal Header
.modal-header {
	padding: 32rpx 40rpx 24rpx 40rpx;
	border-bottom: 1rpx solid #f1f5f9;
	background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.header-content {
	margin-bottom: 16rpx;
}

.header-title {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 8rpx;
}

.title-icon {
	font-size: 32rpx;
}

.title-text {
	font-size: 36rpx;
	font-weight: 700;
	color: #1e293b;
	letter-spacing: -0.5rpx;
}

.header-subtitle {
	margin-left: 48rpx;
}

.subtitle-text {
	font-size: 28rpx;
	color: #64748b;
	line-height: 1.4;
}

.close-btn {
	position: absolute;
	top: 32rpx;
	right: 32rpx;
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: #f8fafc;
	border: 1rpx solid #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	z-index: 2;
}

.close-btn:hover {
	background: #ef4444;
	border-color: #ef4444;
	transform: scale(1.05);
}

.close-btn:active {
	transform: scale(0.95);
}

.close-icon {
	font-size: 32rpx;
	color: #64748b;
	transition: color 0.2s ease;
}

.close-btn:hover .close-icon {
	color: #ffffff;
}

// Search Section
.search-section {
	padding: 24rpx 40rpx;
	border-bottom: 1rpx solid #f1f5f9;
	background: #ffffff;
	/* 确保不会阻止输入事件 */
	pointer-events: none;
}

.search-container {
	position: relative;
	display: flex;
	align-items: center;
	/* 允许输入框接收事件 */
	pointer-events: auto;
}

.search-icon {
	position: absolute;
	left: 32rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 28rpx;
	color: #94a3b8;
	z-index: 1;
}

.search-input {
	width: 100%;
	padding: 32rpx 40rpx 32rpx 72rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 24rpx;
	font-size: 32rpx;
	color: #1e293b;
	transition: all 0.3s ease;
	outline: none;
	box-sizing: border-box;
	/* 确保输入框可以正常接收输入事件 */
	pointer-events: auto !important;
	touch-action: auto !important;
	-webkit-user-select: auto !important;
	user-select: auto !important;
	/* uni-app 兼容性 */
	caret-color: #1e293b;
	-webkit-appearance: none;
	appearance: none;
	/* 防止输入内容溢出 */
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.search-input:focus {
	background: #ffffff;
	border-color: #3b82f6;
	box-shadow: 0 0 0 8rpx rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
	color: #94a3b8;
	font-size: 28rpx;
}

.modal-body {
	flex: 1;
	overflow-y: auto;
	padding: 0;
	background: #f8fafc;
}

// Empty State
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
	text-align: center;
}

.empty-icon-container {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;
}

.empty-icon {
	font-size: 48rpx;
}

.empty-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #475569;
	margin-bottom: 16rpx;
}

.empty-description {
	font-size: 28rpx;
	color: #94a3b8;
	line-height: 1.5;
	max-width: 400rpx;
}

// History List
.history-list {
	display: flex;
	flex-direction: column;
	padding: 24rpx;
	gap: 16rpx;
}

// History Card
.history-card {
	background: #ffffff;
	border-radius: 24rpx;
	border: 1rpx solid #e2e8f0;
	padding: 0;
	transition: all 0.2s ease;
	cursor: pointer;
	overflow: hidden;
}

.history-card:hover {
	border-color: #3b82f6;
	box-shadow:
		0 8rpx 16rpx rgba(0, 0, 0, 0.05),
		0 0 0 1rpx rgba(59, 130, 246, 0.1);
	transform: translateY(-2rpx);
}

.history-card:active {
	transform: translateY(0);
}

// Card Header
.card-header {
	padding: 32rpx 32rpx 24rpx 32rpx;
	border-bottom: 1rpx solid #f1f5f9;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 24rpx;
}

.card-title-area {
	flex: 1;
	min-width: 0;
}

.card-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1e293b;
	line-height: 1.3;
	margin-bottom: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-subtitle {
	font-size: 28rpx;
	color: #64748b;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-badge {
	background: #f1f5f9;
	border-radius: 16rpx;
	padding: 8rpx 16rpx;
	min-width: 0;
	flex-shrink: 0;
}

.badge-text {
	font-size: 24rpx;
	color: #64748b;
	font-weight: 500;
}

// Card Content
.card-content {
	padding: 24rpx 32rpx;
}

.info-row {
	display: flex;
	gap: 32rpx;
	margin-bottom: 16rpx;
}

.info-row:last-child {
	margin-bottom: 0;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
	min-width: 0;
	flex: 1;
}

.info-icon {
	font-size: 24rpx;
	color: #94a3b8;
	flex-shrink: 0;
}

.info-text {
	font-size: 28rpx;
	color: #475569;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

// Card Footer
.card-footer {
	padding: 24rpx 32rpx 32rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1rpx solid #f1f5f9;
}

.action-button {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 16rpx 24rpx;
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	border-radius: 16rpx;
	transition: all 0.2s ease;
}

.action-icon {
	font-size: 24rpx;
	color: #ffffff;
}

.action-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #ffffff;
}

.history-card:hover .action-button {
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.card-arrow {
	font-size: 32rpx;
	color: #cbd5e1;
	transition: color 0.2s ease;
}

.history-card:hover .card-arrow {
	color: #3b82f6;
}


// Empty State
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 40rpx;
	color: $uni-text-color-grey;
}

.empty-state-icon {
	font-size: 80rpx;
	margin-bottom: 24rpx;
	opacity: 0.5;
}

.empty-state-title {
	font-size: 32rpx;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.empty-state-description {
	font-size: 26rpx;
	text-align: center;
	line-height: 1.5;
}

// Animations
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: scale(0.9) translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

// Mobile Optimization
@media (max-width: 375px) {

	.modal-content {
		width: 95%;
		margin: 20rpx;
		max-height: 85vh;
	}

	.modal-header {
		padding: 24rpx;
	}

	.modal-title {
		font-size: 32rpx;
	}

	.modal-body {
		padding: 16rpx 24rpx;
	}

	// Shadcn Modal Responsive Design
	.history-modal {
		padding: 20rpx;
	}

	.modal-content {
		max-width: 95%;
		max-height: 90vh;
	}

	.modal-header {
		padding: 24rpx 32rpx 20rpx 32rpx;
	}

	.header-title {
		gap: 12rpx;
	}

	.title-icon {
		font-size: 28rpx;
	}

	.title-text {
		font-size: 32rpx;
	}

	.subtitle-text {
		font-size: 24rpx;
	}

	.close-btn {
		width: 64rpx;
		height: 64rpx;
		top: 24rpx;
		right: 24rpx;
	}

	.close-icon {
		font-size: 28rpx;
	}

	.search-section {
		padding: 20rpx 32rpx;
	}

	.search-input {
		padding: 24rpx 32rpx 24rpx 64rpx;
		font-size: 28rpx;
	}

	.search-icon {
		left: 24rpx;
		font-size: 24rpx;
	}

	.card-header {
		padding: 24rpx 24rpx 20rpx 24rpx;
	}

	.card-title {
		font-size: 32rpx;
	}

	.card-subtitle {
		font-size: 24rpx;
	}

	.card-content {
		padding: 20rpx 24rpx;
	}

	.info-row {
		gap: 24rpx;
	}

	.info-text {
		font-size: 24rpx;
	}

	.card-footer {
		padding: 20rpx 24rpx 24rpx 24rpx;
	}

	.action-button {
		padding: 12rpx 20rpx;
	}

	.action-text {
		font-size: 24rpx;
	}

	.history-list {
		padding: 20rpx;
		gap: 12rpx;
	}
}

// Large Font Mode (Accessibility)
@media (prefers-reduced-motion: reduce) {
	.history-card,
	.modal-content,
	.close-btn,
	.action-button {
		transition: none;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modalSlideIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
}

// High Contrast Mode
@media (prefers-contrast: high) {
	.modal-content {
		border: 4rpx solid #000000;
		box-shadow: none;
	}

	.history-card {
		border: 2rpx solid #000000;
	}

	.search-input {
		border: 2rpx solid #000000;
	}

	.action-button {
		border: 2rpx solid #000000;
	}
}
</style>