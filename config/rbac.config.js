module.exports = {
  admin: {
    routes: [
      { path: '/appointments', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      { path: '/analytics', methods: ['GET'] },
      { path: '/patient-summary', methods: ['GET'] },
      { path: '/users', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
    ]
  },
  superAdmin: {
    routes: [
      { path: '/appointments', methods: ['GET'] },
      { path: '/patient-summary', methods: ['GET', 'POST'] }
    ]
  },
  user: {
    routes: [
      { path: '/appointments', methods: ['GET'] }
    ]
  }
};