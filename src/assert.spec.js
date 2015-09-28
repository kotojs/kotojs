export default kotoAssert => {

  describe('kotoAssert', () => {
    it('should do nothing when test is truthy', () => {
      expect(() => {
        kotoAssert(true, 'do nothing');
      }).not.to.throw(Error);
    });

    it('should throw error when test is falsy', () => {
      expect(() => {
        kotoAssert(false, 'This should throw an error!');
      }).to.throw(Error);
    });
  });

};