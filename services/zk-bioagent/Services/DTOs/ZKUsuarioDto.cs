namespace zk_bioagent.Services.DTOs
{
    public class ZKUsuarioDto
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public int Privilegio { get; set; }
        public bool Habilitado { get; set; }
        public string DispositivoIp { get; set; }
    }
}
