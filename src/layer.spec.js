module.exports = (Layer, Chart) => {
  d3.select('body').append('div').attr('id', 'mocha');
  d3.select('body').append('div').attr('id', 'test');
  d3.select('body').append('div').attr('id', 'test2');
  describe('d3.layer', function() {
    'use strict';

    before(function () {
      this.Test = Chart;
      this.chart = new this.Test(d3.select('#test'));
      this.inst = this.chart.layer('layer', d3.select('#test2'), {
        dataBind: function () {},
        insert: function () {}
      });
    });

    describe('constructor', function() {

      it('should fail when `dataBind` method is not replaced', function () {
        var layer = new Layer(d3.select('#test2'));
        expect(function () {
          layer.dataBind();
        }).to.throw(Error);
      });

      it('should fail when `insert` method is not replaced', function () {
        var layer = new Layer(d3.select('#test2'));
        expect(function () {
          layer.insert();
        }).to.throw(Error);
      });

      it('should extends the selection with a `draw` method', function() {
        expect(typeof this.inst.draw).to.equal('function');
      });

      it('should extends the selection with an `on` method', function() {
        expect(typeof this.inst.on).to.equal('function');
      });

      it('should extends the selection with an `off` method', function() {
        expect(typeof this.inst.off).to.equal('function');
      });
    });

    describe('#draw', function() {
      beforeEach(function() {
        var dataBind = this.dataBind = sinon.spy(function(data) {
          var updating = this.selectAll('g').data(data, function(d) { return d; });
          // Cache `exit` method so it can be invoked from its stub
          // without provoking infinite recursion.
          var originalExit = updating.exit;

          sinon.spy(updating, 'enter');
          sinon.spy(updating, 'transition');
          // Stub the `exit` method so that we can spy on the generated
          // selections `transition` method.
          sinon.stub(updating, 'exit', function() {
            var exiting = originalExit.apply(this, arguments);
            sinon.spy(exiting, 'transition');
            return exiting;
          });

          return updating;
        });
        var insert = this.insert = sinon.spy(function() {
          var entering = this.insert('g');
          sinon.spy(entering, 'transition');
          return entering;
        });
        var base = this.base = d3.select('#test').append('svg');

        this.layer = this.chart.layer('layer', base, {
          dataBind: dataBind,
          insert: insert
        });
      });

      it('should invokes the provided `dataBind` method exactly once', function() {
        expect(this.dataBind.callCount).to.equal(0);
        this.layer.draw([]);
        expect(this.dataBind.callCount).to.equal(1);
      });

      it('should throw error when dataBind is not set', function () {
        expect(function () {
          this.base.layer({
            insert: this.insert
          }).draw([]);
        }).to.throw(Error);
      });

      it('should invoke the provided `dataBind` method in the context of the layer\'s selection', function() {
        expect(this.dataBind.callCount).to.equal(0);
        this.layer.draw([]);
        expect(this.dataBind.calledOn(this.base)).to.be.true;
      });

      it('should invoke the provided `dataBind` method with the layers context', function() {
        var data = [];
        this.layer.draw(data);
        expect(this.dataBind.args[0][1]).to.equal(this.layer);
      });

      it('should invokes the provided `dataBind` method with the specified data', function() {
        var data = [];
        expect(this.dataBind.callCount).to.equal(0);
        this.layer.draw(data);
        expect(this.dataBind.args[0][0]).to.equal(data);
      });

      it('should throw error when insert is not set', function () {
        expect(function () {
          this.base.layer({
            dataBind: this.dataBind
          }).draw([]);
        }).to.throw(Error);
      });

      it('should invokes the provided `insert` method exactly once', function() {
        expect(this.insert.callCount).to.equal(0);
        this.layer.draw([]);
        expect(this.insert.callCount).to.equal(1);
      });

      it('should immediately invoke callback if transition size < 0', function (done) {
        this.layer.draw([1,2,3]);
        // just chcking to see if the promise works
        this.layer.promise
          .then(function () {
            expect(true).to.be.true;
            done();
          });
      });

      it('should invokes the provided `insert` method in the context of the layer\'s bound `enter` selection',
        function() {
          this.layer.draw([]);
          expect(this.insert.calledOn(this.dataBind.returnValues[0].enter.returnValues[0])).to.be.true;
        }
      );

      describe('event triggering', function() {
        it('should invokes event handlers with the correct selection', function() {
          var base  = this.base.append('g');
          var layer = this.chart.layer('layer', base, {
            insert: function() {
              return this.append('g');
            },
            dataBind: function(data) {
              return this.selectAll('g').data(data, function(d) { return d; });
            }
          });
          // Wrap each assertion in a spy so we can ensure that each actually
          // runs.
          var updateSpy = sinon.spy(function() {
            expect(this.data(), 'update handler').to.deep.equal([3, 4]);
          });
          var enterSpy = sinon.spy(function() {
            // Build the expected sparse array to pass lint and avoid
            // failures due to browser implementation differences
            var expected = [5, 6];
            expect(this.data(), 'enter handler').to.deep.equal(expected);
          });
          var mergeSpy = sinon.spy(function() {
            expect(this.data(), 'merge handler').to.deep.equal([3, 4]);
          });
          var exitSpy = sinon.spy(function() {
            expect(this.data(), 'exit handler').to.deep.equal([1, 2]);
          });
          layer.draw([1, 2, 3, 4]);

          // Bind the spies
          layer.on('update', updateSpy);
          layer.on('enter', enterSpy);
          layer.on('merge', mergeSpy);
          layer.on('exit', exitSpy);

          layer.draw([3, 4, 5, 6]);

          expect(updateSpy.callCount).to.equal(1);
          expect(enterSpy.callCount).to.equal(1);
          expect(mergeSpy.callCount).to.equal(1);
          expect(exitSpy.callCount).to.equal(1);

          layer.remove();
        });

        describe('Layer#off', function() {
          beforeEach(function() {
            this.onEnter1 = sinon.spy();
            this.onEnter2 = sinon.spy();
            this.onUpdate = sinon.spy();
            this.layer = this.chart.layer('name', this.base, {
              insert: this.insert,
              dataBind: this.dataBind
            });
            this.layer.draw([1]);
            this.layer.on('enter', this.onEnter1);
            this.layer.on('enter', this.onEnter2);
            this.layer.on('update', this.onUpdate);
          });

          afterEach(function() {
            this.layer.remove();
          });

          it('should unbinds only the specified handler', function() {
            this.layer.off('enter', this.onEnter1);
            this.layer.draw([1, 2]);

            expect(this.onEnter1.callCount).to.equal(0);
            expect(this.onEnter2.callCount).to.equal(1);
            expect(this.onUpdate.callCount).to.equal(1);
          });

          it('should unbind only the handlers for the specified lifecycle selection', function() {
            this.layer.off('enter');
            this.layer.draw([1]);

            expect(this.onEnter1.callCount).to.equal(0);
            expect(this.onEnter2.callCount).to.equal(0);
            expect(this.onUpdate.callCount).to.equal(1);
          });
        });

        it('should not make transition selections if related handlers are not bound', function() {
          var layer = this.chart.layer('name', this.base.append('g'), {
            insert: this.insert,
            dataBind: this.dataBind
          });
          var spies = {
            update: sinon.spy(),
            enter: sinon.spy(),
            merge: sinon.spy(),
            exit: sinon.spy()
          };
          layer.draw([1, 2]);
          layer.on('update', spies.update);
          layer.on('enter', spies.enter);
          layer.on('merge', spies.merge);
          layer.on('exit', spies.exit);

          layer.draw([2, 3]);

          expect(spies.update.callCount).to.equal(1);
          expect(spies.update.thisValues[0].transition.callCount).to.equal(0);
          expect(spies.enter.callCount).to.equal(1);
          expect(spies.enter.thisValues[0].transition.callCount).to.equal(0);
          expect(spies.merge.callCount).to.equal(1);
          expect(spies.merge.thisValues[0].transition.callCount).to.equal(0);
          expect(spies.exit.callCount).to.equal(1);
          expect(spies.exit.thisValues[0].transition.callCount).to.equal(0);
        });

        describe('bound in constructor', function() {
          beforeEach(function() {
            this.spies = {
              'enter': sinon.spy(),
              'update': sinon.spy(),
              'merge': sinon.spy(),
              'exit': sinon.spy(),
              'enter:transition': sinon.spy(),
              'update:transition': sinon.spy(),
              'merge:transition': sinon.spy(),
              'exit:transition': sinon.spy()
            };
            this.layer = this.chart.layer('name', this.base, {
              dataBind: this.dataBind,
              insert: this.insert,
              events: this.spies
            });
          });

          it('should invokes all event handlers exactly once', function() {
            this.layer.draw([1, 2]);
            Object.keys(this.spies).forEach(function(key) {
              this.spies[key].reset();
            }, this);
            this.layer.draw([2, 3]);

            expect(this.spies.enter.callCount).to.equal(1);
            expect(this.spies.update.callCount).to.equal(1);
            expect(this.spies.merge.callCount).to.equal(1);
            expect(this.spies.exit.callCount).to.equal(1);
            expect(this.spies['enter:transition'].callCount).to.equal(1);
            expect(this.spies['update:transition'].callCount).to.equal(1);
            expect(this.spies['merge:transition'].callCount).to.equal(1);
            expect(this.spies['exit:transition'].callCount).to.equal(1);
          });

          it('should invokes all event handlers in the context of the corresponding \'lifecycle selection\'',
            function() {
              var entering, updating, exiting;
              this.layer.draw([1, 2]);
              this.layer.draw([2, 3]);

              // Alias lifecycle selections
              entering = this.insert.returnValues[0];
              updating = this.dataBind.returnValues[1];
              exiting = updating.exit.returnValues[0];

              expect(this.spies.enter.calledOn(entering)).to.be.true;
              expect(this.spies.update.calledOn(updating)).to.be.true;
              expect(this.spies.merge.calledOn(updating)).to.be.true;
              expect(this.spies.exit.calledOn(exiting)).to.be.true;
              expect(this.spies['enter:transition'].calledOn(entering.transition.returnValues[0])).to.be.true;
              expect(this.spies['update:transition'].calledOn(updating.transition.returnValues[0])).to.be.true;
              expect(this.spies['merge:transition'].calledOn(updating.transition.returnValues[1])).to.be.true;
              expect(this.spies['exit:transition'].calledOn(exiting.transition.returnValues[0])).to.be.true;
            });
          }
        );

        describe('bound with `on`', function() {
          beforeEach(function() {
            this.onEnter1 = sinon.spy();
            this.onUpdate1 = sinon.spy();
            this.onMerge1 = sinon.spy();
            this.onExit1 = sinon.spy();
            this.onEnterTrans1 = sinon.spy();
            this.onUpdateTrans1 = sinon.spy();
            this.onMergeTrans1 = sinon.spy();
            this.onExitTrans1 = sinon.spy();
            this.onUpdate2 = sinon.spy();
            this.onMerge2 = sinon.spy();
            this.onExit2 = sinon.spy();
            this.onExit3 = sinon.spy();
            this.onEnterTrans2 = sinon.spy();
            this.onEnterTrans3 = sinon.spy();
            this.onUpdateTrans2 = sinon.spy();
            this.onMergeTrans2 = sinon.spy();
            this.onMergeTrans3 = sinon.spy();

          });

          it('should invokes all event handlers exactly once', function() {
            this.layer.draw([1, 2]);

            this.layer.on('enter', this.onEnter1);
            this.layer.on('update', this.onUpdate1);
            this.layer.on('update', this.onUpdate2);
            this.layer.on('merge', this.onMerge1);
            this.layer.on('merge', this.onMerge2);
            this.layer.on('exit', this.onExit1);
            this.layer.on('exit', this.onExit2);
            this.layer.on('exit', this.onExit3);
            this.layer.on('enter:transition', this.onEnterTrans1);
            this.layer.on('enter:transition', this.onEnterTrans2);
            this.layer.on('enter:transition', this.onEnterTrans3);
            this.layer.on('update:transition', this.onUpdateTrans1);
            this.layer.on('update:transition', this.onUpdateTrans2);
            this.layer.on('merge:transition', this.onMergeTrans1);
            this.layer.on('merge:transition', this.onMergeTrans2);
            this.layer.on('merge:transition', this.onMergeTrans3);
            this.layer.on('exit:transition', this.onExitTrans1);

            this.layer.draw([2, 3]);

            expect(this.onEnter1.callCount).to.equal(1);
            expect(this.onUpdate1.callCount).to.equal(1);
            expect(this.onUpdate2.callCount).to.equal(1);
            expect(this.onMerge1.callCount).to.equal(1);
            expect(this.onMerge2.callCount).to.equal(1);
            expect(this.onExit1.callCount).to.equal(1);
            expect(this.onExit2.callCount).to.equal(1);
            expect(this.onExit3.callCount).to.equal(1);
            expect(this.onEnterTrans1.callCount).to.equal(1);
            expect(this.onEnterTrans2.callCount).to.equal(1);
            expect(this.onEnterTrans3.callCount).to.equal(1);
            expect(this.onUpdateTrans1.callCount).to.equal(1);
            expect(this.onUpdateTrans2.callCount).to.equal(1);
            expect(this.onMergeTrans1.callCount).to.equal(1);
            expect(this.onMergeTrans2.callCount).to.equal(1);
            expect(this.onMergeTrans3.callCount).to.equal(1);
            expect(this.onExitTrans1.callCount).to.equal(1);
          });

          it('should invokes event handlers in the order they were bound', function() {
            this.layer.on('exit', this.onExit1);
            this.layer.on('exit', this.onExit2);
            this.layer.on('exit', this.onExit3);

            this.layer.draw([1]);
            this.layer.draw([]);

            expect(this.onExit1.calledBefore(this.onExit2)).to.be.true;
            expect(this.onExit2.calledBefore(this.onExit3)).to.be.true;
          });

          it('should invokes all event handlers in the context of the corresponding \'lifecycle selection\'',
            function() {
              var entering, updating, exiting;
              this.layer.on('enter', this.onEnter1);
              this.layer.on('update', this.onUpdate1);
              this.layer.on('merge', this.onMerge1);
              this.layer.on('exit', this.onExit1);
              this.layer.on('enter:transition', this.onEnterTrans1);
              this.layer.on('update:transition', this.onUpdateTrans1);
              this.layer.on('merge:transition', this.onMergeTrans1);
              this.layer.on('exit:transition', this.onExitTrans1);

              this.layer.draw([1, 2]);
              this.layer.draw([2, 3]);

              // Alias lifecycle selections
              entering = this.insert.returnValues[0];
              updating = this.dataBind.returnValues[1];
              exiting = updating.exit.returnValues[0];

              expect(this.onEnter1.calledOn(entering)).to.be.true;
              expect(this.onUpdate1.calledOn(updating)).to.be.true;
              expect(this.onMerge1.calledOn(updating)).to.be.true;
              expect(this.onExit1.calledOn(exiting)).to.be.true;
              expect(this.onEnterTrans1.calledOn(entering.transition.returnValues[0])).to.be.true;
              expect(this.onUpdateTrans1.calledOn(updating.transition.returnValues[0])).to.be.true;
              expect(this.onMergeTrans1.calledOn(updating.transition.returnValues[1])).to.be.true;
              expect(this.onExitTrans1.calledOn(exiting.transition.returnValues[0])).to.be.true;
            }
          );
        });
      });
    });

    describe('events', function () {
      beforeEach(function () {
        this.base = new this.Test(d3.select('#test'));
        this.layer = this.chart.layer('layer', d3.select('#test2'), {
          dataBind: function () {},
          insert: function () {}
        });
      });

      describe('#on', function () {
        it('should returns the layer instance (chains)', function() {
          expect(this.layer.on('enter')).to.equal(this.layer);
        });
      });

      describe('#off', function () {
        it('should returns the layer instance (chains)', function() {
          expect(this.layer.off('enter')).to.equal(this.layer);
        });
      });
    });
  });

};
