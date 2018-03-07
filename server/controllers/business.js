import BusinessData from '../data/business';

/**
 * A class that mannipulates all the business
 */
export default class Business {
/**
 * @param {int} req the request object
 * @param {int} res the response object
 */
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  /**
  * checks if a business exists and creates a new business if such business does not exist
  * @returns {init} returns error or status 200
 */
  createBusiness() {
    const findBusiness = BusinessData.find(data => this.req.body.id === data.id);
    if (findBusiness) {
      return this.res.status(400).json({ business: 'already exist' });
    }
    BusinessData.push(this.req.body);
    return this.res.status(200).json({ business: 'has been created' });
  }
}
