guard 'shell' do
 watch('^Source/(.*).coffee') {|m| `./build` }
end
guard 'sass', :output => 'style' do
  watch('^style/(.*).sass')
end
