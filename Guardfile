# A sample Guardfile
# More info at http://github.com/guard/guard#readme

# Add files and commands to this file, like the example:
#   watch('file/path') { `command(s)` }
#
guard 'shell' do
 watch('^Source/(.*).coffee') {|m| `./build` }
end
guard 'sass', :output => 'style' do
  watch('^style/(.*).sass')
end
