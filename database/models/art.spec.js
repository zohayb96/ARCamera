const {expect} = require('chai')
const db = require('../index')
const Art = db.model('art')
const Sequelize = require('sequelize')

describe('Art model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('model properties', () => {
    let art

    beforeEach(async () => {
      art = await Art.create({
        artPiece: {
          "art": "SomeArt"
        },
        location: [1.94983, 3.3421],
        description: 'fake art',
        likes: 1
      })
    })

    it('returns true if model has artPiece property', () => {
      expect(art).to.have.property('artPiece')
    })

    // it('returns true if artPiece is a JSONB data type', () => {
    //   expect(art.artPiece).to.be.a('json')
    // })

    it('returns true if model has location property', () => {
      expect(art).to.have.property('location')
    })

    it('returns true if location is an array', () => {
      expect(art.location).to.be.an('array')
    })

    it('returns true if model has description property', () => {
      expect(art).to.have.property('description')
    })

    it('returns true if description is a string', () => {
      expect(art.description).to.be.a('string')
    })

    it('returns true if model has likes property', () => {
      expect(art).to.have.property('likes')
    })

    it('returns true if likes is an integer', () => {
      expect(art.likes).to.be.a('number')
    })

  })
})