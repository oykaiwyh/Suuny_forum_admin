import Main from '@/components/main'

export default [
  // 菜单分三种情况
  // 链接式的跳转 -> doc
  // 内嵌的子页面 -> Main Layout -> children
  // 一级菜单上添加的路由 （hideInMenu hideInBread）

  // 内容管理
  // 1. 文章管理 -> 文章内容管理, 文章标签管理（热门、精华 etc）
  {
    path: '/content',
    name: 'content_management',
    meta: {
      icon: 'md-albums',
      title: '内容管理',
      notCache: true
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'article_management',
        meta: {
          icon: 'ios-paper',
          title: '文章管理',
          notCache: true
        },
        component: () => import('@/view/forum-content-manage/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-pricetags',
          title: '标签管理',
          notCache: true
        },
        component: () => import('@/view/forum-content-manage/tags.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-albums',
      title: '用户管理',
      notCache: true
    },
    component: Main,
    children: [{
      path: 'index',
      name: 'user_management',
      meta: {
        icon: 'ios-people',
        title: '用户管理',
        notCache: true
      },
      component: () => import('@/view/forum-user-manage/index.vue')
    }]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理',
      notCache: true
    },
    component: Main,
    children: [{
      path: 'index',
      name: 'menu_management',
      meta: {
        icon: 'ios-menu',
        title: '菜单管理',
        notCache: true
      },
      component: () => import('@/view/forum-menu-manage/index.vue')
    }]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理',
      notCache: true
    },
    component: Main,
    children: [{
      path: 'index',
      name: 'roles_management',
      meta: {
        icon: 'ios-people',
        title: '用户管理',
        notCache: true
      },
      component: () => import('@/view/forum-roles-manage/index.vue')
    }]
  }
  //   {
  //     path: '/comments',
  //     name: 'comments_management',
  //     meta: {
  //       icon: 'ios-umbrella',
  //       title: '内容安全',
  //       notCache: true
  //     },
  //     component: Main,
  //     children: [{
  //       path: 'index',
  //       name: 'comments_list',
  //       meta: {
  //         icon: 'ios-chatbubbles',
  //         title: '评论管理',
  //         notCache: true
  //       },
  //       component: () => import('@/view/comments/index.vue')
  //     }]
  //   },
]
