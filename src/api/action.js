/**
 * 对后台请求的地址的封装，URL格式如下：
 * 模块名_实体名_操作
 */
export default {
	//服务器
	'SERVER': 'http://localhost:7201/',

	//菜单管理
	'BASE_TREENODE_LISTALL': 'treeNode/list',

  //用戶
  'BASE_YONGHU_LIST1': 'logininfo/list',
  'BASE_YONGHU_LISTALL': 'logininfo/list2',
  'BASE_YONGHU_LIST': 'logininfo/list3',
  'BASE_YONGHU_EDIT': 'logininfo/edit',
  'BASE_YONGHU_ADD': 'logininfo/add',

  //借款查询
  'BASE_JIEKUAN_LISTALL': 'bidrequest/list',
  'BASE_JIEKUAN_LIST': 'bidrequest/listAll',
  'BASE_JIEKUAN_EDITBYYAO': 'bidrequest/editByYao',

  //账户流失
  'BASE_ZHANGHU_LISTALL':'repayment/list',

  //模板通知管理
	'REN_TEMPLATE_LIST': 'notice/list',
	'REN_TEMPLATE_DEL': 'notice/del',
	'REN_TEMPLATE_ADDUPDATE': 'notice/addUpdate',


  'SYS_USER_DOLOGIN': 'user/login',
  'SYS_USER_DOLOGINOUT': 'user/loginOut',



	//获得请求的完整地址，用于mockjs测试时使用
  //智能应答管理
  //实名认证
  'YAO_REALAUTH_EDIT': 'realauth/edit',
  'YAO_REALAUTH_LOAD': 'realauth/load',
  'YAO_REALAUTH_LIST': 'realauth/list',

  //线下充值
  'YAO_RECHARGEOFFFLINE_EDIT': 'rechargeoffline/edit',
  'YAO_RECHARGEOFFFLINE_LOAD': 'rechargeoffline/load',
  'YAO_RECHARGEOFFFLINE_LIST': 'rechargeoffline/list',


  //材料认证
  'YAO_USERFILE_EDIT': 'userfile/edit',
  'YAO_USERFILE_LOAD': 'userfile/load',
  'YAO_USERFILE_LIST': 'userfile/list',

  //提现认证
  'YAO_WITHDRAW_EDIT': 'withdraw/edit',
  'YAO_WITHDRAW_LOAD': 'withdraw/load',
  'YAO_WITHDRAW_LIST': 'withdraw/list',

  //满标审核一二认证
  'YAO_FULLSCALETRIAL_EDIT': 'fullscaletrial/edit',
  'YAO_FULLSCALETRIAL_LOAD': 'fullscaletrial/load',
  'YAO_FULLSCALETRIAL_LIST': 'fullscaletrial/list',

  //视频认证
  'YAO_VIDEOAUTH_EDIT': 'videoauth/edit',
  'YAO_VIDEOAUTH_LOAD': 'videoauth/load',
  'YAO_VIDEOAUTH_LIST': 'videoauth/list',

  //获得请求的完整地址，用于mockjs测试时使用
	'getFullPath': k => {
		return this.SERVER + this[k];
	}
}

