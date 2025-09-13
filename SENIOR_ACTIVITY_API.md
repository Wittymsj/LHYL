# 老年活动平台 API 文档

## 概述

本文档为老年活动平台（Senior Activity Platform）的后端API开发规范，采用RESTful设计风格，为前端uni-app应用提供数据交互接口。

### 基础信息

- **Base URL**: `https://api.senior-activity.com/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8
- **响应格式标准**: 统一的JSON响应结构

### 通用响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456789"
}
```

**响应代码说明**：
- `200`: 操作成功
- `400`: 请求参数错误
- `401`: 未授权或token无效
- `403`: 权限不足
- `404`: 资源不存在
- `422`: 数据验证失败
- `500`: 服务器内部错误

### 通用请求头

```
Content-Type: application/json
Authorization: Bearer {access_token}
X-Request-ID: {unique_request_id}
X-Client-Version: {client_version}
```

### 错误响应格式

```json
{
  "code": 400,
  "message": "参数验证失败",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": [
      {
        "field": "phone",
        "message": "手机号码格式不正确"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456789"
}
```

## 数据模型定义

### 1. 用户模型 (User)

```json
{
  "id": "user_123456",
  "openid": "wx_openid_123456",
  "nickname": "张大爷",
  "avatar": "https://example.com/avatar.jpg",
  "name": "张三",
  "phone": "13800138000",
  "wechat": "wx_id_123456",
  "gender": "male",
  "age": 65,
  "city": "北京市",
  "education": "本科",
  "occupation": "退休教师",
  "artGroups": [
    {
      "id": "art_group_1",
      "groupName": "社区合唱团",
      "role": "团员",
      "years": 3,
      "achievements": "社区演出多次"
    }
  ],
  "statistics": {
    "activitiesJoined": 128,
    "activitiesFavorited": 89,
    "averageRating": 4.9
  },
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 2. 活动模型 (Activity)

```json
{
  "id": "activity_123456",
  "organizerId": "organizer_123456",
  "title": "春节联欢会",
  "shortDesc": "与邻里共度新春佳节",
  "description": "详细的活动描述内容",
  "image": "https://example.com/activity.jpg",
  "startTime": "2025-02-10T14:00:00Z",
  "endTime": "2025-02-10T17:00:00Z",
  "location": {
    "province": "北京市",
    "city": "北京市",
    "district": "海淀区",
    "address": "中关村大街1号",
    "fullAddress": "北京市北京市海淀区中关村大街1号"
  },
  "maxParticipants": 100,
  "currentParticipants": 45,
  "fee": 0.00,
  "tags": ["entertainment", "festival", "community"],
  "status": "published",
  "registration": {
    "allowIndividual": true,
    "allowTeam": true,
    "requireApproval": true,
    "personalFields": ["name", "phone", "age", "emergencyContact"],
    "teamFields": ["teamName", "teamLeader", "teamPhone", "programName"],
    "customFields": [
      {
        "id": "custom_1",
        "name": "特殊需求",
        "type": "text",
        "required": false
      }
    ]
  },
  "contact": {
    "name": "李老师",
    "phone": "13900139000",
    "wechat": "li_teacher"
  },
  "statistics": {
    "views": 1250,
    "favorites": 89,
    "registrations": 45
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 3. 报名模型 (Registration)

```json
{
  "id": "registration_123456",
  "activityId": "activity_123456",
  "userId": "user_123456",
  "type": "individual",
  "status": "approved",
  "individualInfo": {
    "name": "张三",
    "phone": "13800138000",
    "age": 65,
    "emergencyContact": "李四 13900139000"
  },
  "teamInfo": {
    "teamName": "快乐舞蹈队",
    "teamLeader": "王五",
    "teamPhone": "13700137000",
    "programName": "民族舞",
    "participantCount": 8,
    "description": "我们是一支热爱舞蹈的老年团队"
  },
  "customFields": {
    "specialNeeds": "需要轮椅通道"
  },
  "source": "wechat",
  "notes": "客户特别要求靠前座位",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 4. 主办方模型 (Organizer)

```json
{
  "id": "organizer_123456",
  "authType": "personal",
  "organizerName": "北京老年活动中心",
  "contactPerson": "李老师",
  "contactPhone": "13900139000",
  "email": "contact@example.com",
  "description": "专业从事老年活动组织的机构",
  "servicePhone": "400-123-4567",
  "wechat": "senior_activity",
  "status": "verified",
  "verification": {
    "idCard": {
      "url": "https://example.com/idcard.jpg",
      "name": "身份证.jpg",
      "status": "approved"
    },
    "certificate": {
      "url": "https://example.com/certificate.jpg",
      "name": "资质证书.jpg",
      "status": "approved"
    },
    "venueProof": {
      "url": "https://example.com/venue.jpg",
      "name": "场地证明.jpg",
      "status": "approved"
    }
  },
  "statistics": {
    "activitiesPublished": 25,
    "totalParticipants": 1250,
    "averageRating": 4.8
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## 1. 认证相关 API

### 1.1 微信登录

**POST** `/auth/wechat-login`

微信小程序登录，获取用户openid并创建或更新用户信息。

**请求参数**：
```json
{
  "code": "微信小程序code",
  "userInfo": {
    "nickName": "张大爷",
    "avatarUrl": "https://example.com/avatar.jpg",
    "gender": 1,
    "city": "北京市"
  }
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 7200,
    "user": {
      "id": "user_123456",
      "nickname": "张大爷",
      "avatar": "https://example.com/avatar.jpg",
      "phone": null,
      "isProfileComplete": false
    }
  }
}
```

### 1.2 手机号绑定

**POST** `/auth/bind-phone`

绑定手机号，使用微信获取的手机号。

**请求参数**：
```json
{
  "code": "微信获取手机号code"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "绑定成功",
  "data": {
    "phone": "13800138000",
    "isProfileComplete": false
  }
}
```

### 1.3 Token刷新

**POST** `/auth/refresh`

刷新访问令牌。

**请求参数**：
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token",
    "expiresIn": 7200
  }
}
```

### 1.4 退出登录

**POST** `/auth/logout`

退出登录，将token加入黑名单。

**响应示例**：
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

---

## 2. 用户资料 API

### 2.1 获取用户资料

**GET** `/users/profile`

获取当前用户的完整资料信息。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "user_123456",
    "nickname": "张大爷",
    "avatar": "https://example.com/avatar.jpg",
    "name": "张三",
    "phone": "13800138000",
    "wechat": "wx_id_123456",
    "gender": "male",
    "age": 65,
    "city": "北京市",
    "education": "本科",
    "occupation": "退休教师",
    "artGroups": [
      {
        "id": "art_group_1",
        "groupName": "社区合唱团",
        "role": "团员",
        "years": 3,
        "achievements": "社区演出多次"
      }
    ],
    "statistics": {
      "activitiesJoined": 128,
      "activitiesFavorited": 89,
      "averageRating": 4.9
    },
    "isProfileComplete": true
  }
}
```

### 2.2 更新用户资料

**PUT** `/users/profile`

更新用户基本信息。

**请求参数**：
```json
{
  "nickname": "张大爷",
  "name": "张三",
  "phone": "13800138000",
  "wechat": "wx_id_123456",
  "gender": "male",
  "age": 65,
  "city": "北京市",
  "education": "本科",
  "occupation": "退休教师",
  "artGroups": [
    {
      "id": "art_group_1",
      "groupName": "社区合唱团",
      "role": "团员",
      "years": 3,
      "achievements": "社区演出多次"
    }
  ]
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "user_123456",
    "nickname": "张大爷",
    "name": "张三",
    "phone": "13800138000",
    "isProfileComplete": true
  }
}
```

### 2.3 上传头像

**POST** `/users/avatar`

上传用户头像。

**请求格式**：`multipart/form-data`

**请求参数**：
- `avatar`: 头像文件 (支持 jpg, png, gif，最大 5MB)

**响应示例**：
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatarUrl": "https://example.com/new_avatar.jpg"
  }
}
```

### 2.4 获取用户统计信息

**GET** `/users/statistics`

获取用户活动统计信息。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "activitiesJoined": 128,
    "activitiesFavorited": 89,
    "activitiesPublished": 5,
    "averageRating": 4.9,
    "recentActivities": [
      {
        "id": "activity_123",
        "title": "春节联欢会",
        "status": "completed",
        "participationDate": "2024-12-25T00:00:00Z"
      }
    ]
  }
}
```

---

## 3. 活动管理 API

### 3.1 活动列表

**GET** `/activities`

获取活动列表，支持分页和筛选。

**请求参数**：
```
?page=1&pageSize=10&category=entertainment&status=published&city=北京市&sort=startTime&order=desc
```

**参数说明**：
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 10, 最大 50)
- `category`: 活动分类 (entertainment, sports, education, etc.)
- `status`: 活动状态 (draft, published, ongoing, completed, cancelled)
- `city`: 城市筛选
- `keyword`: 关键词搜索
- `sort`: 排序字段 (startTime, createdTime, participants)
- `order`: 排序方向 (asc, desc)

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 125,
    "page": 1,
    "pageSize": 10,
    "items": [
      {
        "id": "activity_123456",
        "title": "春节联欢会",
        "shortDesc": "与邻里共度新春佳节",
        "image": "https://example.com/activity.jpg",
        "startTime": "2025-02-10T14:00:00Z",
        "endTime": "2025-02-10T17:00:00Z",
        "location": {
          "city": "北京市",
          "district": "海淀区"
        },
        "maxParticipants": 100,
        "currentParticipants": 45,
        "fee": 0.00,
        "status": "published",
        "tags": ["entertainment", "festival"],
        "organizer": {
          "id": "organizer_123",
          "name": "北京老年活动中心",
          "verified": true
        },
        "statistics": {
          "views": 1250,
          "favorites": 89
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 3.2 活动详情

**GET** `/activities/{activityId}`

获取活动详细信息。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "activity_123456",
    "title": "春节联欢会",
    "shortDesc": "与邻里共度新春佳节",
    "description": "详细的活动描述内容...",
    "image": "https://example.com/activity.jpg",
    "startTime": "2025-02-10T14:00:00Z",
    "endTime": "2025-02-10T17:00:00Z",
    "location": {
      "province": "北京市",
      "city": "北京市",
      "district": "海淀区",
      "address": "中关村大街1号",
      "fullAddress": "北京市北京市海淀区中关村大街1号"
    },
    "maxParticipants": 100,
    "currentParticipants": 45,
    "fee": 0.00,
    "tags": ["entertainment", "festival", "community"],
    "status": "published",
    "registration": {
      "allowIndividual": true,
      "allowTeam": true,
      "requireApproval": true,
      "personalFields": ["name", "phone", "age"],
      "teamFields": ["teamName", "teamLeader", "teamPhone"],
      "customFields": [
        {
          "id": "custom_1",
          "name": "特殊需求",
          "type": "text",
          "required": false
        }
      ]
    },
    "contact": {
      "name": "李老师",
      "phone": "13900139000",
      "wechat": "li_teacher"
    },
    "organizer": {
      "id": "organizer_123",
      "name": "北京老年活动中心",
      "verified": true,
      "rating": 4.8
    },
    "statistics": {
      "views": 1250,
      "favorites": 89,
      "registrations": 45
    },
    "isFavorited": false,
    "isRegistered": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.3 创建活动

**POST** `/activities`

创建新活动，需要主办方认证。

**请求参数**：
```json
{
  "title": "春节联欢会",
  "shortDesc": "与邻里共度新春佳节",
  "description": "详细的活动描述内容...",
  "image": "base64_encoded_image_or_url",
  "startTime": "2025-02-10T14:00:00Z",
  "endTime": "2025-02-10T17:00:00Z",
  "location": {
    "province": "北京市",
    "city": "北京市",
    "district": "海淀区",
    "address": "中关村大街1号"
  },
  "maxParticipants": 100,
  "fee": 0.00,
  "tags": ["entertainment", "festival"],
  "registration": {
    "allowIndividual": true,
    "allowTeam": true,
    "requireApproval": true,
    "personalFields": ["name", "phone", "age"],
    "teamFields": ["teamName", "teamLeader", "teamPhone"],
    "customFields": [
      {
        "id": "custom_1",
        "name": "特殊需求",
        "type": "text",
        "required": false
      }
    ]
  },
  "contact": {
    "name": "李老师",
    "phone": "13900139000",
    "wechat": "li_teacher"
  }
}
```

**响应示例**：
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": "activity_123456",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.4 更新活动

**PUT** `/activities/{activityId}`

更新活动信息。

**请求参数**：与创建活动相同，支持部分更新。

**响应示例**：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "activity_123456",
    "status": "published",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.5 删除活动

**DELETE** `/activities/{activityId}`

删除活动。

**响应示例**：
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 3.6 发布活动

**POST** `/activities/{activityId}/publish`

发布活动，将状态从 draft 改为 published。

**响应示例**：
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "activity_123456",
    "status": "published",
    "publishedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.7 取消活动

**POST** `/activities/{activityId}/cancel`

取消活动。

**请求参数**：
```json
{
  "reason": "场地问题"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "取消成功",
  "data": {
    "id": "activity_123456",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00Z",
    "cancelReason": "场地问题"
  }
}
```

---

## 4. 报名管理 API

### 4.1 活动报名

**POST** `/activities/{activityId}/registrations`

用户报名参加活动。

**请求参数**：
```json
{
  "type": "individual",
  "individualInfo": {
    "name": "张三",
    "phone": "13800138000",
    "age": 65,
    "emergencyContact": "李四 13900139000"
  },
  "teamInfo": {
    "teamName": "快乐舞蹈队",
    "teamLeader": "王五",
    "teamPhone": "13700137000",
    "programName": "民族舞",
    "participantCount": 8,
    "description": "我们是一支热爱舞蹈的老年团队"
  },
  "customFields": {
    "specialNeeds": "需要轮椅通道"
  },
  "source": "wechat"
}
```

**响应示例**：
```json
{
  "code": 201,
  "message": "报名成功",
  "data": {
    "id": "registration_123456",
    "status": "pending",
    "message": "您的报名已提交，等待审核"
  }
}
```

### 4.2 获取报名列表

**GET** `/activities/{activityId}/registrations`

获取活动的报名列表，仅主办方可查看。

**请求参数**：
```
?page=1&pageSize=10&status=pending&type=individual
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 45,
    "page": 1,
    "pageSize": 10,
    "items": [
      {
        "id": "registration_123456",
        "userId": "user_123456",
        "type": "individual",
        "status": "pending",
        "individualInfo": {
          "name": "张三",
          "phone": "13800138000",
          "age": 65
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 4.3 报名详情

**GET** `/registrations/{registrationId}`

获取报名详细信息。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "registration_123456",
    "activityId": "activity_123456",
    "userId": "user_123456",
    "type": "individual",
    "status": "approved",
    "individualInfo": {
      "name": "张三",
      "phone": "13800138000",
      "age": 65,
      "emergencyContact": "李四 13900139000"
    },
    "customFields": {
      "specialNeeds": "需要轮椅通道"
    },
    "source": "wechat",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4.4 审核报名

**PUT** `/registrations/{registrationId}/status`

审核报名申请。

**请求参数**：
```json
{
  "status": "approved",
  "reason": "符合活动要求"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "审核成功",
  "data": {
    "id": "registration_123456",
    "status": "approved",
    "approvedAt": "2024-01-01T00:00:00Z",
    "approvedBy": "organizer_123456"
  }
}
```

### 4.5 取消报名

**POST** `/registrations/{registrationId}/cancel`

用户取消自己的报名。

**请求参数**：
```json
{
  "reason": "时间冲突"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "取消成功",
  "data": {
    "id": "registration_123456",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00Z",
    "cancelReason": "时间冲突"
  }
}
```

### 4.6 获取我的报名

**GET** `/users/registrations`

获取当前用户的报名列表。

**请求参数**：
```
?page=1&pageSize=10&status=active
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 12,
    "page": 1,
    "pageSize": 10,
    "items": [
      {
        "id": "registration_123456",
        "activity": {
          "id": "activity_123456",
          "title": "春节联欢会",
          "startTime": "2025-02-10T14:00:00Z",
          "image": "https://example.com/activity.jpg"
        },
        "status": "approved",
        "type": "individual",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 5. 主办方认证 API

### 5.1 提交认证申请

**POST** `/organizers/auth`

提交主办方认证申请。

**请求参数**：
```json
{
  "authType": "personal",
  "organizerName": "北京老年活动中心",
  "contactPerson": "李老师",
  "contactPhone": "13900139000",
  "email": "contact@example.com",
  "description": "专业从事老年活动组织的机构",
  "servicePhone": "400-123-4567",
  "wechat": "senior_activity",
  "agreement": true,
  "attachments": {
    "idCard": "base64_encoded_id_card",
    "certificate": "base64_encoded_certificate",
    "venueProof": "base64_encoded_venue_proof"
  }
}
```

**响应示例**：
```json
{
  "code": 201,
  "message": "提交成功",
  "data": {
    "id": "organizer_123456",
    "status": "pending",
    "submittedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.2 获取认证状态

**GET** `/organizers/auth/status`

获取当前用户的认证状态。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "organizer_123456",
    "status": "pending",
    "authType": "personal",
    "organizerName": "北京老年活动中心",
    "submittedAt": "2024-01-01T00:00:00Z",
    "reviewComment": null
  }
}
```

### 5.3 获取主办方信息

**GET** `/organizers/{organizerId}`

获取主办方详细信息。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "organizer_123456",
    "authType": "personal",
    "organizerName": "北京老年活动中心",
    "contactPerson": "李老师",
    "contactPhone": "13900139000",
    "email": "contact@example.com",
    "description": "专业从事老年活动组织的机构",
    "servicePhone": "400-123-4567",
    "wechat": "senior_activity",
    "status": "verified",
    "statistics": {
      "activitiesPublished": 25,
      "totalParticipants": 1250,
      "averageRating": 4.8
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 6. 收藏管理 API

### 6.1 收藏活动

**POST** `/activities/{activityId}/favorites`

收藏活动。

**响应示例**：
```json
{
  "code": 201,
  "message": "收藏成功",
  "data": {
    "id": "favorite_123456",
    "activityId": "activity_123456",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 6.2 取消收藏

**DELETE** `/activities/{activityId}/favorites`

取消收藏活动。

**响应示例**：
```json
{
  "code": 200,
  "message": "取消收藏成功",
  "data": null
}
```

### 6.3 获取收藏列表

**GET** `/users/favorites`

获取用户的收藏列表。

**请求参数**：
```
?page=1&pageSize=10
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "items": [
      {
        "id": "favorite_123456",
        "activity": {
          "id": "activity_123456",
          "title": "春节联欢会",
          "shortDesc": "与邻里共度新春佳节",
          "image": "https://example.com/activity.jpg",
          "startTime": "2025-02-10T14:00:00Z",
          "status": "published"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 7. 搜索和推荐 API

### 7.1 搜索活动

**GET** `/search/activities`

搜索活动。

**请求参数**：
```
?keyword=春节&city=北京市&category=entertainment&page=1&pageSize=10
```

**响应示例**：
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "total": 15,
    "page": 1,
    "pageSize": 10,
    "items": [
      {
        "id": "activity_123456",
        "title": "春节联欢会",
        "shortDesc": "与邻里共度新春佳节",
        "image": "https://example.com/activity.jpg",
        "startTime": "2025-02-10T14:00:00Z",
        "location": {
          "city": "北京市",
          "district": "海淀区"
        },
        "fee": 0.00,
        "matchScore": 0.95
      }
    ]
  }
}
```

### 7.2 推荐活动

**GET** `/recommendations/activities`

获取个性化推荐活动。

**请求参数**：
```
?type=personalized&limit=5
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "type": "personalized",
    "items": [
      {
        "id": "activity_123456",
        "title": "春节联欢会",
        "shortDesc": "与邻里共度新春佳节",
        "image": "https://example.com/activity.jpg",
        "startTime": "2025-02-10T14:00:00Z",
        "location": {
          "city": "北京市",
          "district": "海淀区"
        },
        "recommendationReason": "基于您的兴趣标签推荐"
      }
    ]
  }
}
```

### 7.3 热门活动

**GET** `/activities/popular`

获取热门活动。

**请求参数**：
```
?period=week&limit=10
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "period": "week",
    "items": [
      {
        "id": "activity_123456",
        "title": "春节联欢会",
        "shortDesc": "与邻里共度新春佳节",
        "image": "https://example.com/activity.jpg",
        "startTime": "2025-02-10T14:00:00Z",
        "popularityScore": 950,
        "views": 1250,
        "favorites": 89
      }
    ]
  }
}
```

---

## 8. 文件上传 API

### 8.1 上传图片

**POST** `/upload/image`

上传图片文件。

**请求格式**：`multipart/form-data`

**请求参数**：
- `file`: 图片文件 (支持 jpg, png, gif，最大 10MB)
- `type`: 图片类型 (avatar, activity, certificate, etc.)

**响应示例**：
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 8.2 删除文件

**DELETE** `/upload/files/{fileId}`

删除上传的文件。

**响应示例**：
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 9. 系统配置 API

### 9.1 获取活动分类

**GET** `/config/categories`

获取活动分类列表。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "categories": [
      {
        "id": "entertainment",
        "name": "文娱活动",
        "icon": "🎭",
        "description": "各类文化娱乐活动"
      },
      {
        "id": "sports",
        "name": "体育运动",
        "icon": "⚽",
        "description": "各类体育健身活动"
      },
      {
        "id": "education",
        "name": "教育学习",
        "icon": "📚",
        "description": "各类教育培训活动"
      }
    ]
  }
}
```

### 9.2 获取城市列表

**GET** `/config/cities`

获取支持的城市列表。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "provinces": [
      {
        "id": "beijing",
        "name": "北京市",
        "cities": ["东城区", "西城区", "朝阳区", "海淀区"]
      },
      {
        "id": "shanghai",
        "name": "上海市",
        "cities": ["黄浦区", "徐汇区", "长宁区", "静安区"]
      }
    ]
  }
}
```

### 9.3 获取系统参数

**GET** `/config/parameters`

获取系统参数配置。

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "maxActivitiesPerUser": 10,
    "maxRegistrationsPerActivity": 100,
    "maxTeamSize": 20,
    "allowedImageTypes": ["jpg", "jpeg", "png", "gif"],
    "maxImageSize": 10485760,
    "registrationCancellationDeadline": 24
  }
}
```

---

## 10. 错误处理

### 10.1 错误代码定义

| 代码 | 含义 | 说明 |
|------|------|------|
| 10001 | 参数验证失败 | 请求参数不符合要求 |
| 10002 | 用户不存在 | 用户ID无效 |
| 10003 | 权限不足 | 用户无权限执行此操作 |
| 10004 | 活动不存在 | 活动ID无效 |
| 10005 | 报名已满 | 活动报名人数已达上限 |
| 10006 | 已报名 | 用户已报名此活动 |
| 10007 | 活动已取消 | 活动已被取消 |
| 10008 | 报名已截止 | 活动报名时间已截止 |
| 10009 | 文件上传失败 | 文件格式或大小不符合要求 |
| 10010 | 系统维护中 | 系统正在进行维护 |

### 10.2 错误处理建议

1. **参数验证错误**：检查请求参数格式和必填字段
2. **认证错误**：检查token是否有效，是否需要重新登录
3. **权限错误**：确认用户是否有执行操作的权限
4. **资源不存在**：检查ID是否正确，资源是否已被删除
5. **业务逻辑错误**：根据具体错误信息进行相应处理

---

## 11. 安全和性能

### 11.1 安全措施

1. **HTTPS**：所有API必须使用HTTPS协议
2. **Token认证**：使用JWT进行用户认证
3. **参数验证**：所有请求参数进行严格验证
4. **SQL注入防护**：使用参数化查询
5. **XSS防护**：对用户输入进行转义处理
6. **文件上传安全**：检查文件类型、大小和内容

### 11.2 性能优化

1. **分页查询**：所有列表接口支持分页
2. **缓存策略**：热点数据使用缓存
3. **图片优化**：图片压缩和CDN加速
4. **数据库优化**：合理使用索引和查询优化
5. **API限流**：防止恶意请求和DOS攻击

---

## 12. 版本控制

### 12.1 API版本

当前API版本：`v1`

所有API请求都应该包含版本号：
```
https://api.senior-activity.com/v1/activities
```

### 12.2 版本兼容性

- v1版本将保持向后兼容
- 废弃的API将提前3个月通知
- 新版本将在主要路径后添加版本号

---

## 13. 开发建议

### 13.1 最佳实践

1. **错误处理**：正确处理各种错误情况，给出明确的错误信息
2. **数据验证**：在服务端进行严格的数据验证
3. **日志记录**：记录关键操作和错误信息
4. **性能监控**：监控API响应时间和错误率
5. **单元测试**：编写完整的单元测试和集成测试

### 13.2 调试建议

1. 使用 Postman 或类似工具进行API测试
2. 启用详细的错误日志以便调试
3. 在开发环境中使用模拟数据
4. 实施API监控和告警机制

---

*本API文档将根据项目进展持续更新，请确保使用最新版本进行开发。*